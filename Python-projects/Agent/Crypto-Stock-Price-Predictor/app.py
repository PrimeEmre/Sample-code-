from flask import Flask, render_template, request, jsonify, session, send_file
import requests
import json
import os
import io
import base64
import time
from duckduckgo_search import DDGS
from bs4 import BeautifulSoup
from datetime import date
from concurrent.futures import ThreadPoolExecutor, as_completed
import yfinance as yf

app = Flask(__name__, static_folder='static')
app.secret_key = "code_agent_secret_123"

# ── Configuration ──────────────────────────────────────────────
GOOGLE_TTS_KEY = "your_api"
GOOGLE_TTS_URL = f"https://texttospeech.googleapis.com/v1/text:synthesize?key={GOOGLE_TTS_KEY}"

OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL      = "qwen2.5-coder:14b"

MAX_SEARCH_RESULTS = 2
MAX_PAGE_CHARS     = 1500
MAX_TTS_CHARS      = 4500
CACHE_TTL          = 600   # cache results for 10 minutes

# ── In-memory cache ────────────────────────────────────────────
_cache: dict = {}

# ── Smart System Prompt ────────────────────────────────────────
STOCK_SYSTEM_PROMPT = f"""You are a senior financial and crypto analyst at a top investment bank.
Today is {date.today()}.

RULES:
- Use ONLY the numbers provided in the data. Never guess or invent numbers.
- If the ticker ends in -USD it is a cryptocurrency. Skip P/E and dividends for crypto.
- Be direct and specific. No filler sentences.
- Always give a clear BUY, HOLD, or SELL verdict — never be vague.

Write your report using EXACTLY these sections in order:

📈 OVERVIEW:
- Asset name, ticker, current price, market cap, category (Stock or Crypto)
- Sector and industry if available

📊 PRICE ANALYSIS:
- Where the current price sits vs the 52-week high and low (use the actual numbers)
- 1M / 3M / 6M performance trend — is momentum building or fading?
- Volume — is recent volume higher or lower than average? What does that signal?

📰 LATEST NEWS:
- 2 most important news items and their direct effect on price or sentiment

⚡ KEY SIGNALS:
- For stocks: interpret P/E (cheap or expensive for the sector?), dividend sustainability, beta risk
- For crypto: interpret volatility, volume trend, market sentiment

🎯 VERDICT: [BUY / HOLD / SELL]
Confidence: [HIGH / MEDIUM / LOW]
- Reason 1 (with a specific number from the data)
- Reason 2 (with a specific number from the data)
- Reason 3 (with a specific number from the data)
6-Month Price Target: $[your estimate based on trends]
Main Risk: [the single biggest factor that could make this wrong]

⚠️ AI-generated analysis. Not financial advice."""

# ── Ticker corrections ─────────────────────────────────────────
TICKER_CORRECTIONS = {
    # Stocks
    "GOOGLE": "GOOGL", "ALPHABET": "GOOGL",
    "FACEBOOK": "META",
    "AMAZON": "AMZN",
    "MICROSOFT": "MSFT",
    "APPLE": "AAPL",
    "TESLA": "TSLA",
    "NVIDIA": "NVDA",
    "NETFLIX": "NFLX",
    "TWITTER": "X",
    "SNAPCHAT": "SNAP",
    "COINBASE": "COIN",
    "AIRBNB": "ABNB",
    "SPOTIFY": "SPOT",
    "SHOPIFY": "SHOP",
    "PAYPAL": "PYPL",
    "BOEING": "BA",
    "DISNEY": "DIS",
    "WALMART": "WMT",
    "BERKSHIRE": "BRK-B",
    "JPMORGAN": "JPM",
    "GOLDMAN": "GS", "GOLDMANS": "GS",
    "SAMSUNG": "005930.KS",
    "ALIBABA": "BABA",
    "BAIDU": "BIDU",
    "ORACLE": "ORCL",
    "SALESFORCE": "CRM",
    "AMD": "AMD",
    "INTEL": "INTC",
    # Crypto
    "BITCOIN": "BTC-USD", "BTC": "BTC-USD",
    "ETHEREUM": "ETH-USD", "ETH": "ETH-USD",
    "DOGECOIN": "DOGE-USD", "DOGE": "DOGE-USD",
    "SOLANA": "SOL-USD", "SOL": "SOL-USD",
    "RIPPLE": "XRP-USD", "XRP": "XRP-USD",
    "CARDANO": "ADA-USD", "ADA": "ADA-USD",
    "SHIBA": "SHIB-USD", "SHIB": "SHIB-USD",
    "AVALANCHE": "AVAX-USD", "AVAX": "AVAX-USD",
    "POLKADOT": "DOT-USD", "DOT": "DOT-USD",
    "CHAINLINK": "LINK-USD", "LINK": "LINK-USD",
    "LITECOIN": "LTC-USD", "LTC": "LTC-USD",
    "BNBCOIN": "BNB-USD", "BNB": "BNB-USD",
}

# ── Helpers ───────────────────────────────────────────────────
def fmt_large(n):
    if not isinstance(n, (int, float)):
        return "N/A"
    if n >= 1_000_000_000_000:
        return f"${n/1_000_000_000_000:.2f}T"
    elif n >= 1_000_000_000:
        return f"${n/1_000_000_000:.2f}B"
    elif n >= 1_000_000:
        return f"${n/1_000_000:.2f}M"
    return f"${n:,.0f}"

def fmt_volume(n):
    if not isinstance(n, (int, float)):
        return "N/A"
    if n >= 1_000_000_000:
        return f"{n/1_000_000_000:.1f}B"
    elif n >= 1_000_000:
        return f"{n/1_000_000:.1f}M"
    elif n >= 1_000:
        return f"{n/1_000:.1f}K"
    return str(int(n))

def is_crypto(ticker: str) -> bool:
    return ticker.endswith("-USD")

def ollama_chat(messages, temperature=0.3):
    payload = {
        "model": MODEL,
        "messages": messages,
        "stream": False,
        "options": {
            "temperature": temperature,
            "top_p": 0.9,
            "num_ctx": 2048,   # smaller context window = faster on 4GB VRAM
        }
    }
    resp = requests.post(OLLAMA_URL, json=payload, timeout=300)
    resp.raise_for_status()
    return resp.json().get("message", {}).get("content", "").strip()

# ── Web Search ────────────────────────────────────────────────
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

# ── Fear & Greed Index ────────────────────────────────────────
def get_fear_greed() -> str:
    try:
        resp = requests.get(
            "https://production.dataviz.cnn.io/index/fearandgreed/graphdata",
            timeout=5,
            headers={"User-Agent": "Mozilla/5.0"}
        )
        data   = resp.json()
        score  = data["fear_and_greed"]["score"]
        rating = data["fear_and_greed"]["rating"].upper()
        return f"Market Fear & Greed Index: {score:.0f}/100 — {rating}"
    except:
        return "Market Fear & Greed Index: unavailable"

# ── Stock / Crypto Data Fetcher ───────────────────────────────
def get_asset_data(ticker: str) -> dict:
    try:
        stock = yf.Ticker(ticker)

        # Fetch all periods in parallel — BIG speed improvement
        with ThreadPoolExecutor(max_workers=3) as ex:
            f_1m = ex.submit(stock.history, period="1mo")
            f_3m = ex.submit(stock.history, period="3mo")
            f_6m = ex.submit(stock.history, period="6mo")

        history_1m = f_1m.result()
        history_3m = f_3m.result()
        history_6m = f_6m.result()

        # Get info separately — yfinance is not thread-safe for info
        info = stock.info

        # Validate — must have at least some price data
        has_price = (
            not history_1m.empty or
            info.get("regularMarketPrice") is not None or
            info.get("currentPrice") is not None
        )
        if not has_price:
            return {"error": f"'{ticker}' could not be found. Please check the ticker symbol."}

        # ── Current price and 1M stats ──
        if not history_1m.empty:
            current_price    = round(float(history_1m["Close"].iloc[-1]), 2)
            price_1m_ago     = round(float(history_1m["Close"].iloc[0]), 2)
            pct_change_1m    = round(((current_price - price_1m_ago) / price_1m_ago) * 100, 2)
            avg_volume       = int(history_1m["Volume"].mean())
            recent_volume    = int(history_1m["Volume"].iloc[-1])
            volume_vs_avg    = round((recent_volume / avg_volume) * 100, 1) if avg_volume > 0 else 100
        else:
            current_price    = info.get("currentPrice") or info.get("regularMarketPrice") or 0
            pct_change_1m    = 0
            avg_volume       = 0
            recent_volume    = 0
            volume_vs_avg    = 100

        # ── 3M and 6M performance ──
        pct_change_3m = None
        if not history_3m.empty and len(history_3m) > 1:
            p3 = float(history_3m["Close"].iloc[0])
            pct_change_3m = round(((current_price - p3) / p3) * 100, 2)

        pct_change_6m = None
        if not history_6m.empty and len(history_6m) > 1:
            p6 = float(history_6m["Close"].iloc[0])
            pct_change_6m = round(((current_price - p6) / p6) * 100, 2)

        # ── Monthly closes for chart ──
        monthly_closes = {}
        if not history_6m.empty:
            monthly = history_6m["Close"].resample("ME").last()
            for dt, price in monthly.items():
                monthly_closes[dt.strftime("%b %Y")] = round(float(price), 2)

        # ── Last 7 days ──
        last_7_str = "N/A"
        if not history_1m.empty:
            last_7 = history_1m["Close"].tail(7).round(2)
            last_7_str = "  " + "  ".join([f"{str(d)[:10]}: ${p}" for d, p in last_7.to_dict().items()])

        # ── Metrics ──
        pe     = info.get("trailingPE")
        fwd_pe = info.get("forwardPE")
        div    = info.get("dividendYield")
        beta   = info.get("beta")
        target = info.get("targetMeanPrice")
        mktcap = info.get("marketCap")
        w52h   = info.get("fiftyTwoWeekHigh")
        w52l   = info.get("fiftyTwoWeekLow")

        # Where is current price in 52w range (as percentage)
        range_position = None
        if isinstance(w52h, float) and isinstance(w52l, float) and w52h > w52l:
            range_position = round(((current_price - w52l) / (w52h - w52l)) * 100, 1)

        return {
            "ticker":           ticker.upper(),
            "company_name":     info.get("longName", ticker),
            "sector":           info.get("sector") or ("Cryptocurrency" if is_crypto(ticker) else "N/A"),
            "industry":         info.get("industry") or ("Digital Asset" if is_crypto(ticker) else "N/A"),
            "currency":         info.get("currency", "USD"),
            "is_crypto":        is_crypto(ticker),

            # Price
            "current_price":    current_price,
            "52w_high_raw":     w52h,
            "52w_low_raw":      w52l,
            "52w_high_fmt":     f"${w52h:.2f}" if isinstance(w52h, float) else "N/A",
            "52w_low_fmt":      f"${w52l:.2f}" if isinstance(w52l, float) else "N/A",
            "range_position":   range_position,

            # Performance
            "pct_change_1m":    pct_change_1m,
            "pct_change_3m":    pct_change_3m,
            "pct_change_6m":    pct_change_6m,

            # Volume intelligence
            "avg_volume_fmt":   fmt_volume(avg_volume),
            "recent_volume_fmt":fmt_volume(recent_volume),
            "volume_vs_avg":    volume_vs_avg,

            # Chart data
            "monthly_closes":   monthly_closes,
            "last_7_days":      last_7_str,

            # Formatted metrics
            "market_cap_fmt":   fmt_large(mktcap),
            "pe_ratio_fmt":     f"{pe:.1f}" if isinstance(pe, float) else "N/A",
            "forward_pe_fmt":   f"{fwd_pe:.1f}" if isinstance(fwd_pe, float) else "N/A",
            "dividend_fmt":     f"{round(div * 100, 2)}%" if isinstance(div, float) else "N/A",
            "beta_fmt":         f"{beta:.2f}" if isinstance(beta, float) else "N/A",
            "target_fmt":       f"${target:.2f}" if isinstance(target, float) else "N/A",
            "analyst_rating":   info.get("recommendationKey", "N/A").upper(),

            # Raw for AI prompt
            "market_cap":       mktcap,
            "pe_ratio":         pe,
            "forward_pe":       fwd_pe,
            "dividend_yield":   div,
            "beta":             beta,
            "avg_volume":       avg_volume,
            "recent_volume":    recent_volume,
            "target_price":     target,
        }

    except Exception as e:
        return {"error": f"Could not fetch data for {ticker}: {str(e)}"}


def format_for_ai(data: dict) -> str:
    """Compact but information-rich prompt block for the AI."""
    crypto = data["is_crypto"]
    rp = data.get("range_position")
    range_note = f"({rp}% of 52w range)" if rp is not None else ""

    vol_note = ""
    vva = data.get("volume_vs_avg", 100)
    if vva > 150:
        vol_note = f"⚠ Recent volume is {vva}% of average — unusually HIGH"
    elif vva < 60:
        vol_note = f"⚠ Recent volume is {vva}% of average — unusually LOW"
    else:
        vol_note = f"Volume is {vva}% of average — normal range"

    monthly = data.get("monthly_closes", {})
    monthly_str = "  " + "  |  ".join([f"{m}: ${p}" for m, p in monthly.items()]) if monthly else "N/A"

    metrics_block = ""
    if not crypto:
        metrics_block = f"""
Fundamentals:
  P/E Ratio:      {data['pe_ratio_fmt']}
  Forward P/E:    {data['forward_pe_fmt']}
  Dividend Yield: {data['dividend_fmt']}
  Beta:           {data['beta_fmt']}
  Analyst Rating: {data['analyst_rating']}
  Analyst Target: {data['target_fmt']}"""
    else:
        metrics_block = f"""
Crypto Metrics:
  Market Cap:     {data['market_cap_fmt']}
  Circulating Vol:{data['avg_volume_fmt']}
  Beta (Volatility):{data['beta_fmt']}"""

    return f"""=== {'CRYPTO' if crypto else 'STOCK'} DATA: {data['ticker']} ===
Name:             {data['company_name']}
Category:         {'Cryptocurrency' if crypto else 'Stock'}
Sector/Industry:  {data['sector']} / {data['industry']}
Currency:         {data['currency']}

Price Data:
  Current Price:  ${data['current_price']}
  52-Week High:   {data['52w_high_fmt']} {range_note}
  52-Week Low:    {data['52w_low_fmt']}
  Market Cap:     {data['market_cap_fmt']}

Performance:
  1-Month:        {data['pct_change_1m']}%
  3-Month:        {data.get('pct_change_3m') or 'N/A'}%
  6-Month:        {data.get('pct_change_6m') or 'N/A'}%

Volume Intelligence:
  Avg Volume:     {data['avg_volume_fmt']}
  Recent Volume:  {data['recent_volume_fmt']}
  Signal:         {vol_note}
{metrics_block}

Monthly Closes (6M):
{monthly_str}

Last 7 Days:
{data['last_7_days']}
"""


def run_analysis(ticker: str) -> dict:
    """Full analysis pipeline with parallel data fetching and caching."""

    # Check cache first
    if ticker in _cache:
        cached_time, cached_result = _cache[ticker]
        if time.time() - cached_time < CACHE_TTL:
            cached_result["from_cache"] = True
            return cached_result

    # Fetch asset data and fear/greed + news all in parallel
    asset_data_future = None
    with ThreadPoolExecutor(max_workers=4) as ex:
        asset_data_future = ex.submit(get_asset_data, ticker)
        fear_greed_future = ex.submit(get_fear_greed)
        # We need company name for news search so we get asset data first
        asset_data = asset_data_future.result()

        if "error" in asset_data:
            return {"error": asset_data["error"]}

        company_name = asset_data["company_name"]
        crypto       = asset_data["is_crypto"]

        # Now fetch news in parallel (we have company name now)
        if crypto:
            q1 = f"{company_name} crypto price news 2025"
            q2 = f"{company_name} cryptocurrency forecast sentiment 2025"
        else:
            q1 = f"{company_name} {ticker} stock news 2025"
            q2 = f"{company_name} earnings analyst forecast 2025"

        news1_future = ex.submit(web_search, q1)
        news2_future = ex.submit(web_search, q2)

        fear_greed = fear_greed_future.result()
        news1      = news1_future.result()
        news2      = news2_future.result()

    stock_summary = format_for_ai(asset_data)

    context = f"""{stock_summary}

=== MARKET SENTIMENT ===
{fear_greed}

=== LATEST NEWS ===
{news1}

=== ANALYST / MARKET NEWS ===
{news2}
"""

    messages = [
        {"role": "system", "content": STOCK_SYSTEM_PROMPT},
        {"role": "user",   "content": f"Write the analysis report for: {ticker}\n\n{context}"}
    ]

    report = ollama_chat(messages, temperature=0.3)

    result = {
        "ticker":         ticker.upper(),
        "company":        company_name,
        "sector":         asset_data["sector"],
        "industry":       asset_data["industry"],
        "currency":       asset_data["currency"],
        "is_crypto":      crypto,
        "price":          asset_data["current_price"],

        "change_1m":      asset_data["pct_change_1m"],
        "change_3m":      asset_data.get("pct_change_3m"),
        "change_6m":      asset_data.get("pct_change_6m"),

        "monthly_closes": asset_data.get("monthly_closes", {}),

        "w52_high":       asset_data["52w_high_fmt"],
        "w52_low":        asset_data["52w_low_fmt"],
        "w52_high_raw":   asset_data.get("52w_high_raw"),
        "w52_low_raw":    asset_data.get("52w_low_raw"),
        "range_position": asset_data.get("range_position"),

        "market_cap":     asset_data["market_cap_fmt"],
        "pe_ratio":       asset_data["pe_ratio_fmt"],
        "forward_pe":     asset_data["forward_pe_fmt"],
        "dividend":       asset_data["dividend_fmt"],
        "beta":           asset_data["beta_fmt"],
        "avg_volume":     asset_data["avg_volume_fmt"],
        "recent_volume":  asset_data["recent_volume_fmt"],
        "volume_signal":  f"{asset_data.get('volume_vs_avg', 100)}% of avg",
        "target":         asset_data["target_fmt"],
        "analyst_rating": asset_data["analyst_rating"],
        "fear_greed":     fear_greed,

        "report":         report,
        "from_cache":     False,
    }

    # Cache it
    _cache[ticker] = (time.time(), result)
    return result

# ── TTS ───────────────────────────────────────────────────────
def text_to_speech(text: str, voice_name: str) -> bytes:
    lang_code = "-".join(voice_name.split("-")[:2]) if voice_name else "en-US"
    payload = {
        "input": {"text": text[:MAX_TTS_CHARS]},
        "voice": {"languageCode": lang_code, "name": voice_name},
        "audioConfig": {"audioEncoding": "MP3"}
    }
    response = requests.post(GOOGLE_TTS_URL, json=payload, timeout=30)
    response.raise_for_status()
    return base64.b64decode(response.json()["audioContent"])

# ── Routes ────────────────────────────────────────────────────
@app.route("/")
def home():
    session.setdefault("user_id", os.urandom(8).hex())
    return render_template("index.html")

@app.route("/stock", methods=["POST"])
def stock():
    data   = request.get_json()
    ticker = data.get("ticker", "").strip().upper()
    if not ticker:
        return jsonify({"error": "No ticker symbol provided"}), 400

    ticker = TICKER_CORRECTIONS.get(ticker, ticker)

    try:
        result = run_analysis(ticker)
        if "error" in result:
            return jsonify({"error": result["error"]}), 400

        if not result.get("from_cache"):
            os.makedirs("reports", exist_ok=True)
            filename = f"reports/stock_{ticker}_{date.today()}.md"
            with open(filename, "w", encoding="utf-8") as f:
                f.write(f"# {ticker} Analysis — {date.today()}\n\n{result['report']}")
            result["saved_to"] = filename

        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/speak", methods=["POST"])
def speak():
    data       = request.get_json()
    text       = data.get("text", "").strip()
    voice_name = data.get("voice_id", "en-US-Studio-O")
    if not text:
        return jsonify({"error": "No text provided"}), 400
    try:
        audio_data = text_to_speech(text, voice_name)
        return send_file(
            io.BytesIO(audio_data),
            mimetype="audio/mpeg",
            download_name="speech.mp3",
            as_attachment=False
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/voices", methods=["GET"])
def get_voices():
    return jsonify({"voices": [
        {"id": "en-US-Studio-O", "name": "Studio O (Female)"},
        {"id": "en-US-Studio-Q", "name": "Studio Q (Male)"},
    ]})

@app.route("/cache/clear", methods=["POST"])
def clear_cache():
    _cache.clear()
    return jsonify({"message": "Cache cleared"})

if __name__ == "__main__":
    app.run(debug=True)