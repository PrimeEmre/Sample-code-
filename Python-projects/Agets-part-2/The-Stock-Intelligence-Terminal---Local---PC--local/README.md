# 📈 The Stock Intelligence Terminal — Local / PC

> A locally-hosted AI-powered stock and crypto analysis platform that runs entirely on your machine. Combines real-time market data, a local LLM (via Ollama), and optional CrewAI deep-research agents to deliver hedge-fund-grade investment analysis in seconds.

---

## 💡 Introduction

Investing in stocks and crypto can be overwhelming — markets move fast, news changes by the minute, and making sense of technical indicators, valuations, and sentiment all at once is a full-time job. The Stock Intelligence Terminal was built to change that. Instead of paying for expensive financial data subscriptions or trusting black-box online tools, this terminal runs entirely on your own PC, giving you complete privacy and control. It pulls live market data, scans the latest news, reads market sentiment, and passes everything through a powerful local AI model to produce clear, structured, professional-grade investment analysis — the kind of insight that used to require a team of analysts. No cloud. No subscriptions. Just your machine, your data, and your decisions.

---

## 🧠 What It Does

The Stock Intelligence Terminal takes a stock or crypto ticker, pulls live market data, fetches the latest news, reads Fear & Greed sentiment, and then runs it all through a local large language model to generate a professional investment thesis — including technical analysis, fundamental assessment, risk scoring, and a final BUY / HOLD / SELL recommendation.

If you have a CrewAI crew configured, it runs that **in parallel** for a second layer of deep research-agent analysis.

---

## ✨ Features

- **AI-Powered Analysis** — Uses a locally-running Ollama model (auto-selected based on your GPU) to produce structured investment theses.
- **Two-Pass Mode** — On high-end GPUs (20GB+ VRAM), the terminal runs a quantitative signal extraction pass before synthesizing the final thesis, for greater depth and accuracy.
- **Real-Time Market Data** — Pulls price, volume, SMAs, RSI, 52-week range, fundamentals, and analyst targets via `yfinance`.
- **Live News & Sentiment** — Searches DuckDuckGo for the latest headlines and fetches CNN/Alternative.me Fear & Greed Index data.
- **CrewAI Integration** — Optional: connect a CrewAI crew for a fully autonomous second-opinion analysis running in parallel.
- **Auto GPU Detection** — Detects your NVIDIA VRAM and automatically selects the right model and context window.
- **Smart Ticker Correction** — Handles common names ("GOOGLE" → `GOOGL`, "BITCOIN" → `BTC-USD`) and fuzzy-matches typos.
- **Response Caching** — Results are cached for 30 minutes to avoid redundant API calls.
- **Rate Limiting** — Built-in per-IP rate limiting (10 requests/minute) to protect your local resources.
- **Flask Web UI** — Clean browser-based interface served at `localhost:5000`.

---

## 🗂️ Project Structure

```
The-Stock-Intelligence-Terminal/
├── app.py              # Main Flask application (backend logic, AI orchestration)
├── .env                # Environment variables (API keys, secrets)
├── static/             # CSS, JavaScript, and other static assets
└── templates/          # Jinja2 HTML templates for the web UI
```

---

## ⚙️ Requirements

- Python 3.10+
- [Ollama](https://ollama.com/) installed and running locally
- An NVIDIA GPU (recommended; CPU fallback is slow)
- (Optional) A deployed [CrewAI](https://www.crewai.com/) crew with a REST endpoint

### Python Dependencies

Install all required packages:

```bash
pip install flask yfinance duckduckgo-search requests python-dotenv
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/PrimeEmre/The-Stock-Intelligence-Terminal---Local---PC--local.git
cd The-Stock-Intelligence-Terminal---Local---PC--local
```

### 2. Configure Environment Variables

Edit the `.env` file in the project root:

```env
SECRET_KEY=your_flask_secret_key_here

# Optional: override the auto-selected Ollama model
OLLAMA_MODEL=qwen2.5:7b
```

If you want CrewAI integration, also add these to `.env` and update `app.py`:

```python
CREWAI_CREW_URL = "https://your-crew-url.crewai.com"
CREWAI_CREW_TOKEN = "your_bearer_token"
```

### 3. Start Ollama and Pull a Model

```bash
# Start the Ollama server
ollama serve

# In a new terminal, pull a model (the app auto-selects based on VRAM)
ollama pull qwen2.5:7b       # Mid-range GPU (10–20GB VRAM)
ollama pull qwen2.5:14b      # High-end GPU (20GB+ VRAM)
ollama pull qwen2.5-coder:3b # Low-end GPU (<10GB VRAM)
```

### 4. Run the Application

```bash
python app.py
```

Open your browser and go to: **[http://localhost:5000](http://localhost:5000)**

---

## 🖥️ GPU Auto-Selection

The terminal detects your NVIDIA GPU's VRAM at startup and selects the optimal model automatically:

| VRAM        | Profile     | Model               | Context | Two-Pass |
|-------------|-------------|---------------------|---------|----------|
| 20 GB+      | `high_end`  | `qwen2.5:14b`       | 8192    | ✅ Yes   |
| 10–20 GB    | `mid_range` | `qwen2.5:7b`        | 4096    | ❌ No    |
| < 10 GB     | `low_end`   | `qwen2.5-coder:3b`  | 2048    | ❌ No    |

You can override the model at any time by setting `OLLAMA_MODEL` in your `.env` file.

---

### 🏠 Recommended Home GPUs

Not sure if your card is good enough? Here are reliable consumer GPUs that work well with this terminal, grouped by tier:

**✅ High-End — Best experience, Two-Pass mode enabled (20 GB+ VRAM)**

| GPU | VRAM | Notes |
|-----|------|-------|
| NVIDIA RTX 4090 | 24 GB | Best consumer GPU available, runs 14b smoothly |
| NVIDIA RTX 3090 / 3090 Ti | 24 GB | Excellent, widely available second-hand |
| NVIDIA RTX 4080 / 4080 Super | 16 GB | Solid high-end choice |
| NVIDIA RTX A5000 *(workstation)* | 24 GB | Great if you already own one |

**⚡ Mid-Range — Good experience, fast single-pass (10–20 GB VRAM)**

| GPU | VRAM | Notes |
|-----|------|-------|
| NVIDIA RTX 4070 Ti / Ti Super | 16 GB | Best price-to-performance in this tier |
| NVIDIA RTX 4070 | 12 GB | Comfortable everyday pick |
| NVIDIA RTX 3080 (10 GB / 12 GB) | 10–12 GB | Still very capable |
| NVIDIA RTX 3070 Ti | 8 GB | Works well, sits at the edge of this tier |
| NVIDIA RTX 2080 Ti | 11 GB | Older but reliable |

**🟡 Low-End — Functional but slower, uses the 3b model (< 10 GB VRAM)**

| GPU | VRAM | Notes |
|-----|------|-------|
| NVIDIA RTX 4060 Ti | 8 GB | Best budget option for this tier |
| NVIDIA RTX 4060 | 8 GB | Entry-level but perfectly usable |
| NVIDIA RTX 3060 | 12 GB | Great budget pick — more VRAM than its price suggests |
| NVIDIA RTX 3060 Ti | 8 GB | Solid entry-level option |
| NVIDIA RTX 2060 / 2070 | 6–8 GB | Minimum recommended for a usable experience |
| NVIDIA GTX 1080 Ti | 11 GB | Older card, still gets the job done |

> **⚠️ AMD & Intel GPUs:** Ollama has experimental ROCm (AMD) and Arc (Intel) support, but stability varies. NVIDIA is strongly recommended for the best experience.
>
> **💡 No GPU?** The app will fall back to CPU inference — analysis will still work, but may take several minutes instead of seconds.

---

## 🔌 API Endpoints

| Method | Endpoint             | Description                                          |
|--------|----------------------|------------------------------------------------------|
| `GET`  | `/`                  | Web UI                                               |
| `POST` | `/analyze`           | Run full analysis for a given ticker                 |
| `GET`  | `/gpu-info`          | Returns detected GPU profile and model config        |
| `GET`  | `/status/<id>`       | Poll CrewAI job status by kickoff ID                 |
| `GET`  | `/debug-crewai`      | Diagnose CrewAI connectivity and token issues        |
| `POST` | `/test-crewai`       | Kick off a test CrewAI job                           |
| `POST` | `/clear-cache`       | Clear the in-memory analysis cache                   |

### Example: Analyze a Stock

```bash
curl -X POST http://localhost:5000/analyze \
  -H "Content-Type: application/json" \
  -d '{"ticker": "NVDA"}'
```

---

## 📊 Analysis Output

Each analysis response includes:

- **Executive Summary** — Core thesis in 1–2 sentences
- **Technical Analysis** — Price vs SMAs, RSI interpretation, volume conviction
- **Fundamental Assessment** — P/E, P/B, P/S vs sector norms, earnings quality
- **News & Sentiment** — Key headlines and upcoming catalysts
- **Risk Assessment** — Top risks with probability ratings and a Risk Score (1–10)
- **Recommendation** — BUY / HOLD / SELL with conviction level, time horizon, and invalidation conditions
- **CrewAI Analysis** *(optional)* — Parallel deep-research agent output

---

## 🪙 Supported Tickers

The terminal supports stocks, ETFs, and cryptocurrencies. Common name aliases are automatically resolved:

| You type     | Resolves to  |
|--------------|--------------|
| `GOOGLE`     | `GOOGL`      |
| `FACEBOOK`   | `META`       |
| `BITCOIN`    | `BTC-USD`    |
| `ETHEREUM`   | `ETH-USD`    |
| `MICROSOFT`  | `MSFT`       |

Fuzzy matching also handles minor typos in ticker input.

---

## 🛠️ Troubleshooting

**Ollama not running:**
```
Error: Ollama is not running. Start with: ollama serve
```
→ Run `ollama serve` in a terminal, then retry.

**CrewAI not responding:**
→ Visit `http://localhost:5000/debug-crewai` in your browser for a full connectivity diagnostic.

**Stale or incorrect results:**
→ POST to `/clear-cache` to wipe all cached analyses:
```bash
curl -X POST http://localhost:5000/clear-cache
```

**Analysis is slow:**
→ Make sure Ollama is using your GPU (`num_gpu: 99` is set by default). Confirm with `nvidia-smi` that GPU memory is being used during inference.

---

## 📄 License

This project is open source. See the repository for license details.

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

*Built by [PrimeEmre](https://github.com/PrimeEmre)*
