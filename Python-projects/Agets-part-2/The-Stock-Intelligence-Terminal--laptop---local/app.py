import os
import time
import json
import difflib
import threading
import requests
import yfinance as yf
from datetime import date
from dotenv import load_dotenv
from duckduckgo_search import DDGS
from concurrent.futures import ThreadPoolExecutor
from flask import Flask, render_template, request, jsonify, session
import subprocess
from flask import send_from_directory

load_dotenv(override=True)

app = Flask(__name__, static_folder='static', template_folder='templates')
app.secret_key = "stock_intelligence_secret_999"

# ── CONFIGURATION ──────────────────────────────────────────────
CREWAI_CREW_URL    = os.getenv("CREWAI_CREW_URL")
CREWAI_CREW_TOKEN  = os.getenv("CREWAI_CREW_TOKEN")
CREWAI_KICKOFF_URL = f"{CREWAI_CREW_URL}/kickoff" if CREWAI_CREW_URL else ""
CREWAI_STATUS_URL  = f"{CREWAI_CREW_URL}/status/{{kickoff_id}}" if CREWAI_CREW_URL else ""

# ── GPU-AWARE OLLAMA SETTINGS (RTX 3050 4GB) ─────────────────
OLLAMA_URL     = "http://localhost:11434/api/chat"
MODEL          = "qwen2.5-coder:3b"
NUM_CTX        = 2048
NUM_BATCH      = 128
NUM_GPU        = 99
KEEP_ALIVE     = "3m"
NUM_THREAD     = 4

MAX_SEARCH_RESULTS = 5
CACHE_TTL          = 1800
CACHE_MAX_ENTRIES  = 30
CREWAI_POLL_WAIT   = 90   # max seconds to wait for CrewAI during /analyze

_cache = {}
_cache_lock = threading.Lock()
_ollama_semaphore = threading.Semaphore(1)

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
    "SALESFORCE": "CRM", "AMD": "AMD", "INTEL": "INTC",
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
STOCK_SYSTEM_PROMPT = """You are a concise stock analyst. Given raw market data and news, produce a short investment briefing.

Format:
📊 **Quick Summary** — 1-2 sentences on current state.
📈 **Technical View** — Price vs SMAs, 52w range position.
📰 **News Impact** — Key headlines affecting the stock.
⚠️ **Risk Factors** — 1-2 risks.
🎯 **Outlook** — Bull/bear case in 1 sentence each.

Keep total response under 300 words. Use plain text with minimal markdown."""



# ── ICONS / FAVICON ────────────────────────────────────────────
@app.route('/icons/<path:filename>')
def icons(filename):
    return send_from_directory('icons', filename)

@app.route('/favicon.ico')
def favicon():
    return send_from_directory('icons', 'favicon.ico')

# ── HELPERS ────────────────────────────────────────────────────
def suggest_ticker(raw: str) -> str | None:
    matches = difflib.get_close_matches(raw, KNOWN_TICKERS, n=1, cutoff=0.75)
    return matches[0] if matches else None

def is_crypto(ticker: str) -> bool:
    return ticker.upper().endswith("-USD")

def fmt_large(n) -> str:
    if n is None: return "N/A"
    try: n = float(n)
    except (TypeError, ValueError): return "N/A"
    if n >= 1e12: return f"{n/1e12:.2f}T"
    if n >= 1e9:  return f"{n/1e9:.2f}B"
    if n >= 1e6:  return f"{n/1e6:.2f}M"
    if n >= 1e3:  return f"{n/1e3:.1f}K"
    return str(round(n, 2))

def fmt_volume(n) -> str:
    if n is None: return "N/A"
    try: n = float(n)
    except (TypeError, ValueError): return "N/A"
    if n >= 1e9: return f"{n/1e9:.2f}B"
    if n >= 1e6: return f"{n/1e6:.2f}M"
    if n >= 1e3: return f"{n/1e3:.1f}K"
    return str(int(n))

def get_crew_headers():
    return {
        "Authorization": f"Bearer {CREWAI_CREW_TOKEN}",
        "Content-Type":  "application/json",
    }

def cache_set(key, value):
    with _cache_lock:
        while len(_cache) >= CACHE_MAX_ENTRIES:
            oldest_key = min(_cache, key=lambda k: _cache[k][0])
            del _cache[oldest_key]
        _cache[key] = (time.time(), value)

def cache_get(key):
    with _cache_lock:
        if key in _cache:
            ts, res = _cache[key]
            if time.time() - ts < CACHE_TTL:
                return res
            del _cache[key]
    return None
def ensure_ollama_running():
    """Check if Ollama is running; if not, try to start it."""
    try:
        resp = requests.get("http://localhost:11434/api/tags", timeout=3)
        if resp.status_code == 200:
            print("✅ Ollama is running")
            return True
    except requests.exceptions.ConnectionError:
        pass

    print("⏳ Starting Ollama...")
    try:
        subprocess.Popen(
            ["ollama", "serve"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
        # Wait for it to become available
        for _ in range(30):
            time.sleep(1)
            try:
                r = requests.get("http://localhost:11434/api/tags", timeout=3)
                if r.status_code == 200:
                    print("✅ Ollama started successfully")
                    return True
            except:
                continue
    except FileNotFoundError:
        print("❌ Ollama is not installed. Install from https://ollama.com")
        return False

    print("❌ Ollama failed to start")
    return False

# ── OLLAMA (GPU-SAFE) ────────────────────────────────────────
def ollama_chat(messages, temperature=0.3):
    with _ollama_semaphore:
        try:
            payload = {
                "model": MODEL,
                "messages": messages,
                "stream": False,
                "keep_alive": KEEP_ALIVE,
                "options": {
                    "temperature": temperature,
                    "num_ctx":    NUM_CTX,
                    "num_batch":  NUM_BATCH,
                    "num_gpu":    NUM_GPU,
                    "num_thread": NUM_THREAD,
                }
            }
            resp = requests.post(OLLAMA_URL, json=payload, timeout=90)
            resp.raise_for_status()
            content = resp.json().get("message", {}).get("content", "").strip()
            return content if content else "No response from model."
        except requests.exceptions.Timeout:
            return "⚠️ Inference timed out (GPU may be busy). Try again."
        except requests.exceptions.ConnectionError:
            return "⚠️ Ollama is not running. Start it with: ollama serve"
        except Exception as e:
            return f"⚠️ Inference Error: {str(e)}"


# ── MARKET DATA ───────────────────────────────────────────────
def get_asset_data(ticker: str) -> dict:
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period="3mo")
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
        week52_low  = round(float(hist["Low"].min()), 2)

        close  = hist["Close"]
        sma20  = round(float(close.rolling(20).mean().iloc[-1]), 2)  if len(close) >= 20  else None
        sma50  = round(float(close.rolling(50).mean().iloc[-1]), 2)  if len(close) >= 50  else None
        sma200 = None

        avg_volume    = fmt_volume(hist["Volume"].mean())
        latest_volume = fmt_volume(hist["Volume"].iloc[-1])

        company_name = info.get("shortName") or info.get("longName") or ticker
        market_cap   = fmt_large(info.get("marketCap"))
        sector       = info.get("sector", "Crypto" if crypto else "N/A")
        industry     = info.get("industry", "N/A")
        country      = info.get("country", "N/A")

        pe_ratio     = info.get("trailingPE", "N/A")
        fwd_pe       = info.get("forwardPE", "N/A")
        ps_ratio     = info.get("priceToSalesTrailing12Months", "N/A")
        pb_ratio     = info.get("priceToBook", "N/A")
        eps          = info.get("trailingEps", "N/A")
        beta         = info.get("beta", "N/A")
        dividend     = info.get("dividendYield")
        dividend_str = f"{dividend*100:.2f}%" if dividend else "N/A"

        target_mean = info.get("targetMeanPrice", "N/A")
        target_high = info.get("targetHighPrice", "N/A")
        target_low  = info.get("targetLowPrice", "N/A")
        rec_key     = info.get("recommendationKey", "N/A")

        return {
            "ticker":                   ticker.upper(),
            "company_name":             company_name,
            "is_crypto":                crypto,
            "current_price":            current_price,
            "prev_close":               prev_close,
            "price_change":             price_change,
            "pct_change":               pct_change,
            "week52_high":              week52_high,
            "week52_low":               week52_low,
            "sma20":                    sma20,
            "sma50":                    sma50,
            "sma200":                   sma200,
            "avg_volume":               avg_volume,
            "latest_volume":            latest_volume,
            "market_cap":               market_cap,
            "sector":                   sector,
            "industry":                 industry,
            "country":                  country,
            "pe_ratio":                 pe_ratio,
            "fwd_pe":                   fwd_pe,
            "ps_ratio":                 ps_ratio,
            "pb_ratio":                 pb_ratio,
            "eps":                      eps,
            "beta":                     beta,
            "dividend_yield":           dividend_str,
            "analyst_target_mean":      target_mean,
            "analyst_target_high":      target_high,
            "analyst_target_low":       target_low,
            "analyst_recommendation":   rec_key,
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
    try:
        resp = requests.get(
            "https://production.dataviz.cnn.io/index/fearandgreed/graphdata",
            timeout=5, headers={"User-Agent": "Mozilla/5.0"}
        )
        data = resp.json()
        return f"Fear & Greed: {data['fear_and_greed']['score']:.0f}/100 ({data['fear_and_greed']['rating'].upper()})"
    except:
        return "Fear & Greed: unavailable"


# ── CREWAI ────────────────────────────────────────────────────
def kickoff_crew(ticker: str) -> str:
    """Kick off CrewAI crew and return the kickoff_id."""
    payload = {"inputs": {"ticker": ticker.upper(), "today": str(date.today())}}
    resp = requests.post(CREWAI_KICKOFF_URL, headers=get_crew_headers(), json=payload, timeout=60)
    resp.raise_for_status()
    data = resp.json()
    return data.get("kickoff_id") or data.get("id")

def poll_crew_result(kickoff_id: str, max_wait: int = 300):
    """Poll CrewAI until done or max_wait seconds. Returns (result_text, status)."""
    url = CREWAI_STATUS_URL.format(kickoff_id=kickoff_id)
    deadline = time.time() + max_wait
    while time.time() < deadline:
        try:
            resp = requests.get(url, headers=get_crew_headers(), timeout=15)
            resp.raise_for_status()
            data = resp.json()
            status = (data.get("status") or data.get("state") or "").lower()
            if status in ("completed", "success", "finished"):
                return data.get("result") or data.get("output") or str(data), "completed"
            if status in ("failed", "error"):
                return None, "failed"
        except:
            pass
        time.sleep(4)
    return None, "pending"

def run_crew_analysis(ticker: str):
    """
    Kick off CrewAI and poll for up to CREWAI_POLL_WAIT seconds.
    Returns (result_text_or_None, status_string, kickoff_id_or_None).
    """
    kickoff_id = None
    try:
        kickoff_id = kickoff_crew(ticker)
    except Exception as e:
        return None, f"kickoff_failed: {str(e)}", None

    result, status = poll_crew_result(kickoff_id, max_wait=CREWAI_POLL_WAIT)
    return result, status, kickoff_id


# ── ROUTES ─────────────────────────────────────────────────────
@app.route("/")
def home():
    session.setdefault("user_id", os.urandom(8).hex())
    return render_template("index.html")

@app.route("/analyze", methods=["POST"])
def analyze():
    req_data  = request.get_json()
    raw_input = (req_data.get("ticker") or "").strip().upper()

    if not raw_input:
        return jsonify({"error": "Please provide a ticker symbol."}), 400

    ticker = TICKER_CORRECTIONS.get(raw_input, raw_input)

    try:
        # ── Cache hit ──────────────────────────────────────────
        cached = cache_get(ticker)
        if cached:
            return jsonify(cached)

        # ── Validate with yfinance ─────────────────────────────
        asset_data = get_asset_data(ticker)

        if "error" in asset_data:
            suggestion = suggest_ticker(raw_input)
            if suggestion and suggestion != ticker:
                corrected = get_asset_data(suggestion)
                if "error" not in corrected:
                    ticker     = suggestion
                    asset_data = corrected
                else:
                    return jsonify({
                        "error": f"{asset_data['error']} Did you mean '{suggestion}'?"
                    }), 400
            else:
                return jsonify({"error": asset_data["error"]}), 400

        # ── Parallel: news + fear/greed ────────────────────────
        with ThreadPoolExecutor(max_workers=2) as ex:
            fg_task   = ex.submit(get_fear_greed)
            news_task = ex.submit(
                web_search,
                f"{asset_data['company_name']} stock news {date.today().year}"
            )
            fg_result   = fg_task.result()
            news_result = news_task.result()

        # ── Build context for Ollama ───────────────────────────
        context = (
            f"Stock Data: {json.dumps(asset_data)}\n"
            f"Market Sentiment: {fg_result}\n"
            f"Latest News:\n{news_result}"
        )
        ollama_messages = [
            {"role": "system", "content": STOCK_SYSTEM_PROMPT},
            {"role": "user",   "content": context},
        ]

        # ── RUN BOTH IN PARALLEL ──────────────────────────────
        #  Thread 1 → CrewAI (cloud, slow)  ~60-90s
        #  Thread 2 → Ollama  (local GPU, fast) ~15-30s
        with ThreadPoolExecutor(max_workers=2) as ex:
            crew_task  = ex.submit(run_crew_analysis, ticker)
            ollama_task = ex.submit(ollama_chat, ollama_messages)

            crew_result, crew_status, kickoff_id = crew_task.result()
            ollama_report = ollama_task.result()

        # ── Build response ─────────────────────────────────────
        result = {
            "ticker": ticker,
            "result": {
                "thesis":        ollama_report,        # local quick analysis
                "crew_analysis": crew_result,          # cloud deep analysis (may be None)
                "crew_status":   crew_status,          # "completed" | "pending" | "failed" | "kickoff_failed: ..."
                "kickoff_id":    kickoff_id,           # for frontend polling if pending
            },
            "data": asset_data,
        }

        # Only full-cache when CrewAI is also done
        if crew_status == "completed":
            cache_set(ticker, result)

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/status/<kickoff_id>", methods=["GET"])
def status(kickoff_id):
    """Poll CrewAI status. Frontend calls this when crew_status == 'pending'."""
    try:
        url = CREWAI_STATUS_URL.format(kickoff_id=kickoff_id)
        resp = requests.get(url, headers=get_crew_headers(), timeout=15)
        return jsonify(resp.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── RUN ────────────────────────────────────────────────────────
if __name__ == "__main__":
    app.run(debug=True, threaded=True, host="0.0.0.0", port=5000)