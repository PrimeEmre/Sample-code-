import os
import time
import json
import logging
import difflib
import subprocess
import threading
import requests
import yfinance as yf
from datetime import date
from dotenv import load_dotenv
from duckduckgo_search import DDGS
from concurrent.futures import ThreadPoolExecutor
from flask import Flask, render_template, request, jsonify, abort, session

load_dotenv(override=True)

# ── LOGGING ───────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)

app = Flask(__name__, static_folder='static', template_folder='templates')
app.secret_key = os.getenv("SECRET_KEY") or os.urandom(32)

# ── CONFIGURATION ──────────────────────────────────────────────
CREWAI_CREW_URL    = "your crew url"
CREWAI_CREW_TOKEN  = "your token"
CREWAI_KICKOFF_URL = f"{CREWAI_CREW_URL}/kickoff" if CREWAI_CREW_URL else ""
CREWAI_STATUS_URL  = f"{CREWAI_CREW_URL}/status/{{kickoff_id}}" if CREWAI_CREW_URL else ""

OLLAMA_URL     = "http://localhost:11434/api/chat"
OVERRIDE_MODEL = os.getenv("OLLAMA_MODEL")

# ── STARTUP DIAGNOSTICS ───────────────────────────────────────
log.info("=" * 60)
log.info("  STOCK INTELLIGENCE TERMINAL — STARTUP CHECK")
log.info("=" * 60)

CREWAI_AVAILABLE = False
CREWAI_STARTUP_ERROR = ""
if not CREWAI_CREW_URL:
    CREWAI_STARTUP_ERROR = "CREWAI_CREW_URL is missing from .env"
    log.warning("  CrewAI: NOT CONFIGURED — %s", CREWAI_STARTUP_ERROR)
elif not CREWAI_CREW_TOKEN:
    CREWAI_STARTUP_ERROR = "CREWAI_CREW_TOKEN is missing from .env"
    log.warning("  CrewAI: NOT CONFIGURED — %s", CREWAI_STARTUP_ERROR)
else:
    try:
        _probe = requests.get(
            CREWAI_CREW_URL,
            headers={"Authorization": f"Bearer {CREWAI_CREW_TOKEN}"},
            timeout=10,
        )
        CREWAI_AVAILABLE = True
        log.info("  CrewAI: REACHABLE (HTTP %d)", _probe.status_code)
    except requests.exceptions.ConnectionError:
        CREWAI_STARTUP_ERROR = "Connection refused"
        log.warning("  CrewAI: NOT REACHABLE — connection refused (will try on kickoff)")
    except requests.exceptions.Timeout:
        CREWAI_STARTUP_ERROR = "Connection timed out"
        log.warning("  CrewAI: NOT REACHABLE — timed out (will try on kickoff)")
    except Exception as e:
        CREWAI_STARTUP_ERROR = str(e)
        log.warning("  CrewAI: PROBE FAILED — %s (will try on kickoff anyway)", e)

OLLAMA_AVAILABLE = False
try:
    _tags = requests.get("http://localhost:11434/api/tags", timeout=5)
    OLLAMA_AVAILABLE = True
    _model_names = [m["name"] for m in _tags.json().get("models", [])]
    log.info("  Ollama: RUNNING — models: %s", ", ".join(_model_names[:5]))
except Exception:
    log.warning("  Ollama: NOT RUNNING — start with 'ollama serve'")

log.info("=" * 60)

# ── GPU AUTO-DETECTION ────────────────────────────────────────
def detect_gpu_vram() -> float:
    try:
        result = subprocess.run(
            ["nvidia-smi", "--query-gpu=memory.total", "--format=csv,noheader,nounits"],
            capture_output=True, text=True, timeout=5,
        )
        if result.returncode == 0:
            vram_mb = int(result.stdout.strip().split('\n')[0].strip())
            return round(vram_mb / 1024, 1)
    except Exception:
        pass
    return 8.0

def get_gpu_profile():
    vram = detect_gpu_vram()
    if vram >= 20:   return "high_end", vram
    elif vram >= 10: return "mid_range", vram
    else:            return "low_end", vram

GPU_PROFILES = {
    "high_end": {
        "model": "qwen2.5:14b", "num_ctx": 8192, "num_batch": 512,
        "num_gpu": 99, "num_thread": 8, "keep_alive": "5m",
        "two_pass": True, "temperature": 0.4,
    },
    "mid_range": {
        "model": "qwen2.5:7b", "num_ctx": 4096, "num_batch": 256,
        "num_gpu": 99, "num_thread": 6, "keep_alive": "3m",
        "two_pass": False, "temperature": 0.3,
    },
    "low_end": {
        "model": "qwen2.5-coder:3b", "num_ctx": 2048, "num_batch": 128,
        "num_gpu": 99, "num_thread": 4, "keep_alive": "3m",
        "two_pass": False, "temperature": 0.3,
    },
}

GPU_PROFILE_NAME, GPU_VRAM = get_gpu_profile()
GPU_CONFIG = GPU_PROFILES[GPU_PROFILE_NAME]
if OVERRIDE_MODEL:
    GPU_CONFIG["model"] = OVERRIDE_MODEL

log.info("  GPU: %sGB VRAM -> %s", GPU_VRAM, GPU_PROFILE_NAME)
log.info("  Model: %s | Context: %s | Two-pass: %s",
         GPU_CONFIG["model"], GPU_CONFIG["num_ctx"], GPU_CONFIG["two_pass"])

# ── CACHE ─────────────────────────────────────────────────────
CACHE_TTL          = 1800
CACHE_MAX_ENTRIES  = 50
MAX_SEARCH_RESULTS = 5

CREWAI_POLL_WAIT = 270

_cache      = {}
_cache_lock = threading.Lock()

_ollama_semaphore = threading.Semaphore(1)

# ── RATE LIMITER ──────────────────────────────────────────────
_rate_buckets: dict = {}
_rate_lock = threading.Lock()

def _rate_limit_check(max_per_minute: int = 10) -> None:
    ip  = request.remote_addr or "unknown"
    now = time.time()
    with _rate_lock:
        timestamps = [t for t in _rate_buckets.get(ip, []) if now - t < 60]
        if len(timestamps) >= max_per_minute:
            abort(429, description="Rate limit exceeded. Please wait before retrying.")
        timestamps.append(now)
        _rate_buckets[ip] = timestamps

# ── TICKER CORRECTIONS ────────────────────────────────────────
TICKER_CORRECTIONS = {
    "GOOGLE": "GOOGL", "ALPHABET": "GOOGL", "FACEBOOK": "META",
    "AMAZON": "AMZN", "MICROSOFT": "MSFT", "APPLE": "AAPL",
    "TESLA": "TSLA", "NVIDIA": "NVDA", "NETFLIX": "NFLX",
    "TWITTER": "X", "SNAPCHAT": "SNAP", "COINBASE": "COIN",
    "AIRBNB": "ABNB", "SPOTIFY": "SPOT", "SHOPIFY": "SHOP",
    "PAYPAL": "PYPL", "BOEING": "BA", "DISNEY": "DIS",
    "WALMART": "WMT", "BERKSHIRE": "BRK-B", "JPMORGAN": "JPM",
    "GOLDMAN": "GS", "GOLDMANS": "GS", "SAMSUNG": "005930.KS",
    "ALIBABA": "BABA", "BAIDU": "BIDU", "ORACLE": "ORCL",
    "SALESFORCE": "CRM", "INTEL": "INTC",
    "BITCOIN": "BTC-USD", "BTC": "BTC-USD", "ETHEREUM": "ETH-USD",
    "ETH": "ETH-USD", "DOGECOIN": "DOGE-USD", "DOGE": "DOGE-USD",
    "SOLANA": "SOL-USD", "SOL": "SOL-USD", "RIPPLE": "XRP-USD",
    "XRP": "XRP-USD", "CARDANO": "ADA-USD", "ADA": "ADA-USD",
    "SHIBA": "SHIB-USD", "SHIB": "SHIB-USD", "AVALANCHE": "AVAX-USD",
    "AVAX": "AVAX-USD", "POLKADOT": "DOT-USD", "DOT": "DOT-USD",
    "CHAINLINK": "LINK-USD", "LINK": "LINK-USD", "LITECOIN": "LTC-USD",
    "LTC": "LTC-USD", "BNBCOIN": "BNB-USD", "BNB": "BNB-USD",
}

KNOWN_TICKERS = set(TICKER_CORRECTIONS.values()) | {
    "NVDA", "AAPL", "MSFT", "GOOGL", "AMZN", "META", "TSLA", "AMD",
    "INTC", "NFLX", "PYPL", "SHOP", "SPOT", "ABNB", "COIN", "SNAP",
    "BA", "DIS", "WMT", "JPM", "GS", "BRK-B", "ORCL", "CRM", "PLTR",
    "UBER", "LYFT", "HOOD", "SOFI", "RBLX", "PINS", "TWLO", "ZM",
    "BTC-USD", "ETH-USD", "DOGE-USD", "SOL-USD", "XRP-USD",
    "ADA-USD", "SHIB-USD", "AVAX-USD", "DOT-USD", "LINK-USD",
    "LTC-USD", "BNB-USD",
}

# ── SYSTEM PROMPTS ─────────────────────────────────────────────
STOCK_SYSTEM_PROMPT_SINGLE = """You are a Senior Hedge Fund Portfolio Manager with 20 years of experience in both technical and fundamental analysis.

Analyze the provided stock/crypto data, market sentiment, and news. Think step by step.

## OUTPUT FORMAT (use exactly these sections):

### Executive Summary
[1-2 sentences: current state and the single most important signal]

### Technical Analysis
[Price vs SMAs -> trend direction. RSI -> overbought/oversold. Volume vs average -> conviction. 52w range position.]

### Fundamental Assessment
[P/E, P/B, P/S vs sector norms. Earnings quality. Competitive moat strength.]

### News & Sentiment Impact
[Key headlines, market narrative direction, upcoming catalysts in 30-90 days]

### Risk Assessment
[Top 2-3 specific risks with probability: High/Med/Low]
**Risk Score:** X/10 (1=very safe, 10=very risky)

### Recommendation
**Verdict:** [BUY / HOLD / SELL]
**Conviction:** [HIGH / MEDIUM / LOW]
**Time Horizon:** [Short-term / Medium-term / Long-term]
**Key Catalyst:** [What would confirm this thesis]
**If Wrong:** [What would invalidate this thesis]

Be specific with numbers. Be decisive. No hedging."""

STOCK_SYSTEM_PROMPT_PASS1 = """You are a Quantitative Analyst. Extract key trading signals from the provided market data, sentiment, and news.

Analyze systematically and list each signal:

1. TECHNICAL SIGNALS: SMA crossovers, RSI overbought/oversold, volume anomalies, price vs 52w range
2. FUNDAMENTAL SIGNALS: Valuation vs sector, earnings trajectory, margin trends, competitive position
3. SENTIMENT SIGNALS: News direction, Fear & Greed implication, social momentum
4. RISK SIGNALS: Beta exposure, macro sensitivity, concentration risk

Format each signal as:
- SIGNAL: [specific description with numbers] | DIRECTION: [bullish/bearish/neutral] | STRENGTH: [strong/moderate/weak]

Be precise. Use numbers. Do NOT write a narrative, just extract signals."""

STOCK_SYSTEM_PROMPT_PASS2 = """You are a Senior Hedge Fund Portfolio Manager making a final investment decision.

Given the extracted quantitative signals below, write a professional investment thesis.

## OUTPUT FORMAT:

### Executive Summary
[1-2 sentences with the core thesis and conviction level]

### Technical Analysis
[Synthesize technical signals into a clear directional view with entry/exit levels]

### Fundamental Assessment
[Is this fairly valued? What is the margin of safety? Competitive advantage durability?]

### Catalysts & Sentiment
[What could move the stock in the next 30-90 days? Directional bias?]

### Risk Assessment
[Top risks ranked by probability x impact]
**Risk Score:** X/10

### Recommendation
**Verdict:** [BUY / HOLD / SELL]
**Conviction:** [HIGH / MEDIUM / LOW]
**Time Horizon:** [Short-term / Medium-term / Long-term]
**Key Catalyst:** [What would confirm this thesis]
**If Wrong:** [What would invalidate this thesis]

Be decisive. Pick a side. Quantify everything you can."""


# ── HELPERS ────────────────────────────────────────────────────
def suggest_ticker(raw: str):
    matches = difflib.get_close_matches(raw, KNOWN_TICKERS, n=1, cutoff=0.75)
    return matches[0] if matches else None

def is_crypto(ticker: str) -> bool:
    return ticker.upper().endswith("-USD")

def fmt_large(n):
    if not isinstance(n, (int, float)): return "N/A"
    if n >= 1e12: return f"${n/1e12:.2f}T"
    if n >= 1e9:  return f"${n/1e9:.2f}B"
    if n >= 1e6:  return f"${n/1e6:.2f}M"
    return f"${n:,.0f}"

def fmt_volume(n):
    if not isinstance(n, (int, float)): return "N/A"
    if n >= 1e9: return f"{n/1e9:.1f}B"
    if n >= 1e6: return f"{n/1e6:.1f}M"
    return str(int(n))

def compute_rsi(close_prices, period: int = 14):
    try:
        delta = close_prices.diff()
        gain  = delta.where(delta > 0, 0.0).rolling(window=period).mean()
        loss  = (-delta.where(delta < 0, 0.0)).rolling(window=period).mean()
        rs    = gain / loss
        rsi   = 100 - (100 / (1 + rs))
        val   = rsi.iloc[-1]
        return round(float(val), 1) if not val.isna() else None
    except Exception:
        return None

def get_crew_headers() -> dict:
    return {
        "Authorization": f"Bearer {CREWAI_CREW_TOKEN}",
        "Content-Type":  "application/json",
    }

def cache_set(key: str, value) -> None:
    with _cache_lock:
        while len(_cache) >= CACHE_MAX_ENTRIES:
            oldest_key = min(_cache, key=lambda k: _cache[k][0])
            del _cache[oldest_key]
        _cache[key] = (time.time(), value)

def cache_get(key: str):
    with _cache_lock:
        if key in _cache:
            ts, res = _cache[key]
            if time.time() - ts < CACHE_TTL:
                return res
            del _cache[key]
    return None

def cache_clear() -> int:
    """Nuke the entire cache. Returns number of entries cleared."""
    with _cache_lock:
        n = len(_cache)
        _cache.clear()
        return n


# ── OLLAMA ────────────────────────────────────────────────────
def ollama_chat(messages: list, temperature=None) -> str:
    temp = temperature if temperature is not None else GPU_CONFIG["temperature"]
    with _ollama_semaphore:
        try:
            payload = {
                "model":      GPU_CONFIG["model"],
                "messages":   messages,
                "stream":     False,
                "keep_alive": GPU_CONFIG["keep_alive"],
                "options": {
                    "temperature": temp,
                    "num_ctx":     GPU_CONFIG["num_ctx"],
                    "num_batch":   GPU_CONFIG["num_batch"],
                    "num_gpu":     GPU_CONFIG["num_gpu"],
                    "num_thread":  GPU_CONFIG["num_thread"],
                },
            }
            log.info("[OLLAMA] Sending to %s...", GPU_CONFIG["model"])
            resp = requests.post(OLLAMA_URL, json=payload, timeout=300)
            resp.raise_for_status()
            content = resp.json().get("message", {}).get("content", "").strip()
            log.info("[OLLAMA] Response received (%d chars)", len(content))
            return content if content else "No response from model."
        except requests.exceptions.Timeout:
            log.error("[OLLAMA] Timed out")
            return "Ollama timed out. Try again in 30 seconds."
        except requests.exceptions.ConnectionError:
            log.error("[OLLAMA] Connection refused")
            return "Ollama is not running. Start with: ollama serve"
        except Exception as e:
            log.error("[OLLAMA] Error: %s", e)
            return f"Inference Error: {str(e)}"


def ollama_analyze(asset_data: dict, fg_result: str, news_result: str) -> dict:
    compact_data = {
        "ticker":        asset_data["ticker"],
        "name":          asset_data["company_name"],
        "sector":        asset_data["sector"],
        "industry":      asset_data["industry"],
        "price":         asset_data["current_price"],
        "change":        asset_data["price_change"],
        "pct_change":    asset_data["pct_change"],
        "high_52w":      asset_data["week52_high"],
        "low_52w":       asset_data["week52_low"],
        "sma20":         asset_data.get("sma20"),
        "sma50":         asset_data.get("sma50"),
        "sma200":        asset_data.get("sma200"),
        "rsi":           asset_data.get("rsi"),
        "volume_latest": asset_data["latest_volume_raw"],
        "volume_avg":    asset_data["avg_volume_raw"],
        "volume_ratio":  asset_data.get("volume_ratio"),
        "market_cap":    asset_data["market_cap_raw"],
        "pe":            asset_data["pe_ratio"],
        "fwd_pe":        asset_data["fwd_pe"],
        "ps":            asset_data["ps_ratio"],
        "pb":            asset_data["pb_ratio"],
        "eps":           asset_data["eps"],
        "beta":          asset_data["beta"],
        "dividend":      asset_data["dividend_yield_raw"],
        "analyst_rec":   asset_data["analyst_recommendation"],
        "target_mean":   asset_data["analyst_target_mean"],
        "target_high":   asset_data["analyst_target_high"],
        "target_low":    asset_data["analyst_target_low"],
    }

    context = (
        f"Stock Data: {json.dumps(compact_data)}\n"
        f"Market Sentiment: {fg_result}\n"
        f"Latest News:\n{news_result}"
    )

    if GPU_CONFIG["two_pass"]:
        log.info("[OLLAMA] Two-pass: extracting signals...")
        signals = ollama_chat([
            {"role": "system", "content": STOCK_SYSTEM_PROMPT_PASS1},
            {"role": "user",   "content": context},
        ])
        log.info("[OLLAMA] Two-pass: synthesizing thesis...")
        thesis = ollama_chat([
            {"role": "system", "content": STOCK_SYSTEM_PROMPT_PASS2},
            {"role": "user",
             "content": f"Original Data:\n{context}\n\nExtracted Signals:\n{signals}"},
        ], temperature=0.3)
        return {"thesis": thesis, "signals": signals}
    else:
        log.info("[OLLAMA] Single-pass mode...")
        thesis = ollama_chat([
            {"role": "system", "content": STOCK_SYSTEM_PROMPT_SINGLE},
            {"role": "user",   "content": context},
        ])
        return {"thesis": thesis, "signals": None}


# ── CREWAI ────────────────────────────────────────────────────
def kickoff_crew(ticker: str) -> str:
    payload = {"inputs": {"ticker": ticker.upper(), "today": str(date.today())}}
    log.info("[CREWAI] Kicking off crew for %s...", ticker)
    log.info("[CREWAI] POST %s", CREWAI_KICKOFF_URL)
    resp = requests.post(
        CREWAI_KICKOFF_URL, headers=get_crew_headers(), json=payload, timeout=60
    )
    log.info("[CREWAI] Kickoff response: HTTP %d", resp.status_code)
    resp.raise_for_status()
    data       = resp.json()
    kickoff_id = data.get("kickoff_id") or data.get("id")
    log.info("[CREWAI] Kickoff OK — ID: %s", kickoff_id)
    return kickoff_id

def poll_crew_result(kickoff_id: str, max_wait: int = 300):
    url      = CREWAI_STATUS_URL.format(kickoff_id=kickoff_id)
    deadline = time.time() + max_wait
    polls    = 0
    log.info("[CREWAI] Polling %s (max %ds)...", kickoff_id, max_wait)
    while time.time() < deadline:
        try:
            resp   = requests.get(url, headers=get_crew_headers(), timeout=15)
            resp.raise_for_status()
            data   = resp.json()
            status = (data.get("status") or data.get("state") or "").lower()
            polls += 1
            if polls % 5 == 1:
                log.info("[CREWAI] Status: %s (poll #%d)", status, polls)
            if status in ("completed", "success", "finished"):
                result = data.get("result") or data.get("output") or str(data)
                log.info("[CREWAI] Completed after %d polls", polls)
                return result, "completed"
            if status in ("failed", "error"):
                log.error("[CREWAI] Failed: %s", data)
                return None, "failed"
        except Exception as e:
            log.warning("[CREWAI] Poll error: %s", e)
        time.sleep(4)
    log.warning("[CREWAI] Timed out after %ds (%d polls)", max_wait, polls)
    return None, "pending"

def run_crew_analysis(ticker: str):
    """
    EXACTLY matches the working code: no guards, just try it.
    If URL/token are missing, kickoff_crew will fail and we catch it.
    """
    kickoff_id = None
    try:
        kickoff_id = kickoff_crew(ticker)
    except requests.exceptions.ConnectionError:
        log.error("[CREWAI] Connection refused — is the URL correct?")
        return None, "connection_error", None
    except requests.exceptions.HTTPError as e:
        log.error("[CREWAI] HTTP %s — check your token and URL", e.response.status_code)
        return None, f"http_error_{e.response.status_code}", None
    except Exception as e:
        log.error("[CREWAI] Kickoff failed: %s", e)
        return None, f"kickoff_failed: {str(e)}", None

    result, status = poll_crew_result(kickoff_id, max_wait=CREWAI_POLL_WAIT)
    return result, status, kickoff_id


# ── MARKET DATA ───────────────────────────────────────────────
def get_asset_data(ticker: str) -> dict:
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period="1y")
        if hist.empty:
            return {"error": f"Symbol '{ticker}' not found or has no recent data."}

        info   = stock.info or {}
        crypto = is_crypto(ticker)
        dp     = 4 if crypto else 2

        current_price = round(float(hist["Close"].iloc[-1]), dp)
        prev_close    = round(float(hist["Close"].iloc[-2]), dp) if len(hist) > 1 else current_price
        price_change  = round(current_price - prev_close, dp)
        pct_change    = round((price_change / prev_close) * 100, 2) if prev_close else 0

        week52_high = round(float(hist["High"].max()), 2)
        week52_low  = round(float(hist["Low"].min()),  2)

        close  = hist["Close"]
        sma20  = round(float(close.rolling(20).mean().iloc[-1]),  2) if len(close) >= 20  else None
        sma50  = round(float(close.rolling(50).mean().iloc[-1]),  2) if len(close) >= 50  else None
        sma200 = round(float(close.rolling(200).mean().iloc[-1]), 2) if len(close) >= 200 else None
        rsi    = compute_rsi(close)

        avg_volume_raw    = float(hist["Volume"].mean())
        latest_volume_raw = float(hist["Volume"].iloc[-1])
        vol_ratio = None
        try:
            vol_ratio = round(latest_volume_raw / avg_volume_raw, 2)
        except Exception:
            pass

        company_name   = info.get("shortName") or info.get("longName") or ticker
        market_cap_raw = info.get("marketCap")
        market_cap_fmt = fmt_large(market_cap_raw)
        sector   = info.get("sector",   "Crypto" if crypto else "N/A")
        industry = info.get("industry", "N/A")
        country  = info.get("country",  "N/A")

        pe_ratio = info.get("trailingPE", "N/A")
        fwd_pe   = info.get("forwardPE",  "N/A")
        ps_ratio = info.get("priceToSalesTrailing12Months", "N/A")
        pb_ratio = info.get("priceToBook",  "N/A")
        eps      = info.get("trailingEps",  "N/A")
        beta     = info.get("beta",         "N/A")

        dividend_raw = info.get("dividendYield")
        dividend_fmt = f"{dividend_raw*100:.2f}%" if dividend_raw else "N/A"

        target_mean = info.get("targetMeanPrice", "N/A")
        target_high = info.get("targetHighPrice", "N/A")
        target_low  = info.get("targetLowPrice",  "N/A")
        rec_key     = info.get("recommendationKey", "N/A")

        tech_signals = []
        if sma20:
            tech_signals.append(
                "Price > SMA20 (short-term bullish)" if current_price > sma20
                else "Price < SMA20 (short-term bearish)"
            )
        if sma50:
            tech_signals.append(
                "Price > SMA50 (medium-term bullish)" if current_price > sma50
                else "Price < SMA50 (medium-term bearish)"
            )
        if rsi:
            if rsi > 70:   tech_signals.append(f"RSI {rsi} (OVERBOUGHT)")
            elif rsi < 30: tech_signals.append(f"RSI {rsi} (OVERSOLD)")
            else:          tech_signals.append(f"RSI {rsi} (neutral)")
        if vol_ratio and vol_ratio > 1.5:
            tech_signals.append(f"Volume {vol_ratio}x average (high activity)")

        return {
            "ticker":                 ticker.upper(),
            "company_name":           company_name,
            "is_crypto":              crypto,
            "current_price":          current_price,
            "prev_close":             prev_close,
            "price_change":           price_change,
            "pct_change":             pct_change,
            "week52_high":            week52_high,
            "week52_low":             week52_low,
            "sma20":                  sma20,
            "sma50":                  sma50,
            "sma200":                 sma200,
            "rsi":                    rsi,
            "volume_ratio":           vol_ratio,
            "avg_volume_raw":         avg_volume_raw,
            "latest_volume_raw":      latest_volume_raw,
            "avg_volume":             fmt_volume(avg_volume_raw),
            "latest_volume":          fmt_volume(latest_volume_raw),
            "market_cap_raw":         market_cap_raw,
            "market_cap":             market_cap_fmt,
            "sector":                 sector,
            "industry":               industry,
            "country":                country,
            "pe_ratio":               pe_ratio,
            "fwd_pe":                 fwd_pe,
            "ps_ratio":               ps_ratio,
            "pb_ratio":               pb_ratio,
            "eps":                    eps,
            "beta":                   beta,
            "dividend_yield_raw":     dividend_raw,
            "dividend_yield":         dividend_fmt,
            "analyst_target_mean":    target_mean,
            "analyst_target_high":    target_high,
            "analyst_target_low":     target_low,
            "analyst_recommendation": rec_key,
            "tech_signals":           tech_signals,
        }
    except Exception as e:
        return {"error": f"Data fetch error: {str(e)}"}


def web_search(query: str) -> str:
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=MAX_SEARCH_RESULTS))
        if not results:
            return "No results found."
        return "\n---\n".join(
            f"Title: {r['title']}\nSummary: {r['body']}" for r in results
        )
    except Exception as e:
        return f"Search error: {e}"


def get_fear_greed() -> str:
    sources = [
        ("cnn",         "https://production.dataviz.cnn.io/index/fearandgreed/graphdata"),
        ("alternative", "https://api.alternative.me/fng/?limit=1"),
    ]
    for name, url in sources:
        try:
            resp = requests.get(url, timeout=5, headers={"User-Agent": "Mozilla/5.0"})
            data = resp.json()
            if name == "cnn" and "fear_and_greed" in data:
                score  = data["fear_and_greed"]["score"]
                rating = data["fear_and_greed"]["rating"].upper()
                return f"Fear & Greed: {score:.0f}/100 ({rating})"
            if name == "alternative" and data.get("data"):
                entry  = data["data"][0]
                score  = entry.get("value", "?")
                rating = entry.get("value_classification", "?").upper()
                return f"Fear & Greed: {score}/100 ({rating})"
        except Exception as e:
            log.warning("[F&G] %s failed: %s", name, e)
    return "Fear & Greed: unavailable"


# ── ROUTES ─────────────────────────────────────────────────────
@app.route("/")
def home():
    return render_template("index.html")


@app.route("/analyze", methods=["POST"])
def analyze():
    _rate_limit_check()

    req_data  = request.get_json()
    raw_input = (req_data.get("ticker") or "").strip().upper()

    if not raw_input:
        return jsonify({"error": "Please provide a ticker symbol."}), 400

    ticker = TICKER_CORRECTIONS.get(raw_input, raw_input)
    log.info("ANALYZE REQUEST: %s -> %s", raw_input, ticker)

    try:
        cached = cache_get(ticker)
        if cached:
            log.info("Cache hit for %s — SKIPPING CrewAI call", ticker)
            return jsonify(cached)

        log.info("[DATA] Fetching yfinance data for %s...", ticker)
        asset_data = get_asset_data(ticker)

        if "error" in asset_data:
            suggestion = suggest_ticker(raw_input)
            if suggestion and suggestion != ticker:
                corrected = get_asset_data(suggestion)
                if "error" not in corrected:
                    log.info("[DATA] Auto-corrected %s -> %s", ticker, suggestion)
                    ticker     = suggestion
                    asset_data = corrected
                else:
                    return jsonify({
                        "error": f"{asset_data['error']} Did you mean '{suggestion}'?"
                    }), 400
            else:
                return jsonify({"error": asset_data["error"]}), 400

        log.info("[DATA] %s — $%s (%s%%)",
                 ticker, asset_data["current_price"], asset_data["pct_change"])

        log.info("[SEARCH] Fetching news + sentiment...")
        with ThreadPoolExecutor(max_workers=2) as ex:
            fg_task   = ex.submit(get_fear_greed)
            news_task = ex.submit(
                web_search,
                f"{asset_data['company_name']} stock news {date.today().isoformat()}"
            )
            fg_result   = fg_task.result()
            news_result = news_task.result()
        log.info("[SEARCH] Done — %s", fg_result)

        log.info("[PARALLEL] Launching CrewAI + Ollama simultaneously...")
        log.info("[CREWAI] About to call run_crew_analysis for %s", ticker)
        with ThreadPoolExecutor(max_workers=2) as ex:
            crew_task   = ex.submit(run_crew_analysis, ticker)
            ollama_task = ex.submit(ollama_analyze, asset_data, fg_result, news_result)

            crew_result, crew_status, kickoff_id = crew_task.result()
            ollama_output = ollama_task.result()

        log.info("[CREWAI] RESULT — status: %s, kickoff_id: %s, result: %s",
                 crew_status, kickoff_id,
                 f"{len(crew_result)} chars" if crew_result else "None")

        thesis = ollama_output["thesis"]
        log.info(
            "RESULTS — Ollama: %d chars | CrewAI: %s%s",
            len(thesis), crew_status,
            f" ({len(crew_result)} chars)" if crew_result else "",
        )

        result = {
            "ticker": ticker,
            "result": {
                "thesis":        thesis,
                "signals":       ollama_output.get("signals"),
                "crew_analysis": crew_result,
                "crew_status":   crew_status,
                "kickoff_id":    kickoff_id,
                "gpu_profile":   GPU_PROFILE_NAME,
                "model_used":    GPU_CONFIG["model"],
                "two_pass":      GPU_CONFIG["two_pass"],
            },
            "data": asset_data,
        }

        ollama_ok = thesis and not thesis.startswith("Ollama") and \
                    not thesis.startswith("Inference Error")
        if ollama_ok:
            cache_set(ticker, result)

        return jsonify(result)

    except Exception as e:
        log.error("Unhandled error in /analyze: %s", e, exc_info=True)
        return jsonify({"error": str(e)}), 500


@app.route("/status/<kickoff_id>", methods=["GET"])
def status(kickoff_id):
    try:
        url  = CREWAI_STATUS_URL.format(kickoff_id=kickoff_id)
        resp = requests.get(url, headers=get_crew_headers(), timeout=15)
        data = resp.json()
        log.info("[CREWAI] Status poll %s: %s",
                 kickoff_id, data.get("status") or data.get("state"))
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/gpu-info", methods=["GET"])
def gpu_info():
    return jsonify({
        "profile":            GPU_PROFILE_NAME,
        "vram_gb":            GPU_VRAM,
        "model":              GPU_CONFIG["model"],
        "num_ctx":            GPU_CONFIG["num_ctx"],
        "two_pass":           GPU_CONFIG["two_pass"],
        "crewai_available":   CREWAI_AVAILABLE,
        "crewai_error":       CREWAI_STARTUP_ERROR or None,
        "ollama_available":   OLLAMA_AVAILABLE,
    })


@app.route("/debug-crewai", methods=["GET"])
def debug_crewai():
    info = {
        "1_url_loaded":    bool(CREWAI_CREW_URL),
        "2_token_loaded":  bool(CREWAI_CREW_TOKEN),
        "3_token_preview": (
            CREWAI_CREW_TOKEN[:4] + "..." + CREWAI_CREW_TOKEN[-4:]
            if len(CREWAI_CREW_TOKEN) > 8
            else f"ONLY {len(CREWAI_CREW_TOKEN)} CHARS — token is probably truncated in .env!"
        ),
        "4_token_length":  len(CREWAI_CREW_TOKEN),
        "5_crew_available": CREWAI_AVAILABLE,
        "6_startup_error":  CREWAI_STARTUP_ERROR or "none",
        "7_kickoff_url":    CREWAI_KICKOFF_URL,
        "8_cache_entries":  len(_cache),
    }

    if not CREWAI_CREW_URL or not CREWAI_CREW_TOKEN:
        info["diagnosis"] = "TOKEN OR URL MISSING — check your .env file"
        return jsonify(info), 200

    try:
        kick = requests.post(
            CREWAI_KICKOFF_URL,
            headers=get_crew_headers(),
            json={"inputs": {"ticker": "AAPL", "today": str(date.today())}},
            timeout=20,
        )
        info["9_kickoff_http_status"] = kick.status_code
        info["9_kickoff_response"]    = kick.text[:500]
        if kick.status_code == 200:
            info["diagnosis"] = "SUCCESS — CrewAI kickoff is working!"
        elif kick.status_code == 401:
            info["diagnosis"] = "401 UNAUTHORIZED — your token is wrong or expired"
        elif kick.status_code == 403:
            info["diagnosis"] = "403 FORBIDDEN — token loaded but not authorized for this crew"
        elif kick.status_code == 404:
            info["diagnosis"] = "404 NOT FOUND — the crew URL is wrong"
        else:
            info["diagnosis"] = f"Unexpected HTTP {kick.status_code} — see response above"
    except Exception as e:
        info["9_kickoff_error"] = str(e)
        info["diagnosis"] = f"Could not reach kickoff endpoint: {e}"

    return jsonify(info), 200


@app.route("/test-crewai", methods=["POST"])
def test_crewai():
    """Quick connectivity test: kick off CrewAI and return the kickoff ID."""
    try:
        ticker     = (request.get_json() or {}).get("ticker", "AAPL")
        kickoff_id = kickoff_crew(ticker)
        return jsonify({"kickoff_id": kickoff_id, "status": "kicked_off"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/clear-cache", methods=["POST"])
def clear_cache():
    """NUKE the cache — old poisoned results may be blocking CrewAI calls."""
    n = cache_clear()
    log.info("[CACHE] Cleared %d entries", n)
    return jsonify({"cleared": n, "message": "Cache nuked. Try analyzing again."})


# ── RUN ────────────────────────────────────────────────────────
if __name__ == "__main__":
    # NUKE CACHE ON STARTUP so old poisoned results don't block CrewAI
    _cache.clear()
    log.info("[CACHE] Cleared on startup")
    app.run(debug=True, threaded=True, host="0.0.0.0", port=5000)