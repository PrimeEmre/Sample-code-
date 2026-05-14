# 📈 The Stock Intelligence Terminal — Laptop / Local

A fully local, privacy-first Stock Intelligence Terminal purpose-built to run on laptops with the **NVIDIA GeForce RTX 3050 Laptop GPU**. No cloud APIs, no data leaks — your financial data and AI processing stay entirely on your machine.

---

## 🚀 Overview

The Stock Intelligence Terminal is a powerful, self-hosted financial analysis dashboard designed to run **100% locally** on your laptop. It combines real-time market data ingestion, technical analysis, AI-driven insights, and a sleek terminal-style interface — all without relying on external cloud services.

Whether you're a day trader, swing trader, or long-term investor, this terminal gives you the edge of institutional-grade analytics from the comfort of your own machine.

---

## 🎯 Target Hardware & System Requirements

> 🚨 **Please Note:** This project is specifically designed, tested, and optimized exclusively for laptops equipped with the **NVIDIA GeForce RTX 3050 Laptop GPU**.

Based on real-world system profiling, the terminal is tuned to squeeze the absolute maximum performance out of this specific hardware configuration:

| Component | Requirement / Target Spec | Details |
|-----------|--------------------------|---------|
| **GPU** | NVIDIA RTX 3050 Laptop GPU | Mandatory. Used for local LLM inference (CUDA) and UI rendering. |
| **VRAM** | 4.0 GB | The terminal's AI models and quantization levels are specifically chosen to fit within the 4GB VRAM limit of the RTX 3050. |
| **System RAM** | 16 GB | Data caching, Pandas/Polars dataframes, and CPU offloading require high memory. (Expect ~13-14GB usage during heavy operations). |
| **CPU** | Modern Multi-core (e.g., 2.27GHz+) | Handles data ingestion, technical indicator calculations, and background tasks. |

> ⚠️ **Why the RTX 3050 Laptop?** Local LLM execution requires CUDA. The RTX 3050 Laptop (4GB VRAM) is the perfect entry-point for local AI. We have optimized the Ollama/LM Studio configurations and model sizes to run flawlessly on 4GB VRAM without crashing, while leaving enough overhead for the data engine to run simultaneously.

---

## ✨ Features

### 📊 Market Data & Monitoring
- Real-time stock price tracking for NYSE, NASDAQ, and more
- Multi-asset support — Stocks, ETFs, Crypto, Forex
- Custom watchlists with instant alerts
- Historical data caching for offline analysis

### 🧠 AI-Powered Intelligence (RTX 3050 Optimized)
- **Local LLM integration** — Run sentiment analysis and market summaries using CUDA on your RTX 3050, without sending data to the cloud
- **News sentiment scoring** — Aggregates and scores financial news
- **Pattern recognition** — Detect chart patterns automatically
- **Anomaly detection** — Spot unusual volume or price movements

### 📉 Technical Analysis
- **50+ built-in indicators** — SMA, EMA, RSI, MACD, Bollinger Bands, ATR, Ichimoku, and more
- **Custom indicator builder** — Write your own indicators
- **Multi-timeframe analysis** — 1m, 5m, 15m, 1h, 4h, 1D, 1W
- **Backtesting engine** — Test strategies against historical data

### 🖥️ Terminal-Style Interface
- Dark-themed, distraction-free UI inspired by Bloomberg/Refinitiv terminals
- Multi-panel layout — View charts, order books, news, and AI insights simultaneously
- Keyboard-driven navigation — Stay fast and efficient
- Customizable widgets — Arrange your workspace your way

### 🔒 Privacy & Security
- **100% local execution** — No data leaves your machine
- **No account required** — No sign-ups, no tracking
- **Encrypted local storage** — Your strategies and watchlists are safe

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Backend** | Python 3.10+ |
| **Data Engine** | Pandas, NumPy, Polars |
| **Technical Analysis** | TA-Lib, pandas-ta |
| **AI / LLM** | Ollama / LM Studio (CUDA accelerated via RTX 3050) |
| **Charting** | Plotly / MPLFinance |
| **UI / Frontend** | Textual (TUI) / Streamlit / PyQt |
| **Database** | SQLite / DuckDB (local) |
| **Data Sources** | yfinance, Alpha Vantage (free tier), Finnhub |

---

## 📦 Installation

### Prerequisites

- A laptop with an **NVIDIA RTX 3050 GPU (4GB VRAM) & 16GB RAM**
- NVIDIA Studio or Game Ready Drivers (latest version for CUDA support)
- Python 3.10+
- Git
- [Ollama](https://ollama.ai) (for local LLM features) — [Install Guide](https://ollama.ai/download)
- TA-Lib C library — [Install Guide](https://github.com/TA-Lib/ta-lib-python)

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/PrimeEmre/The-Stock-Intelligence-Terminal--laptop---local.git
cd The-Stock-Intelligence-Terminal--laptop---local

# 2. Create a virtual environment
python -m venv venv
source venv/bin/activate        # Linux/macOS
# venv\Scripts\activate         # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. (Crucial for RTX 3050) Pull a 4GB VRAM-friendly LLM model
# Ensure Ollama is running and utilizes your RTX 3050
ollama pull phi3:mini           # HIGHLY RECOMMENDED for 4GB VRAM
# or
ollama pull llama3:8b-instruct-q4_0  # Quantized to fit 4GB VRAM

# 5. Configure your settings
# Copy the example environment file and add your keys
cp .env.example .env
# Edit the .env file with your preferred settings and API keys

# 6. Launch the terminal
python app.py
```

---

## 🤖 Local LLM Integration (Optimized for 4GB VRAM)

This terminal leverages **Ollama** or **LM Studio** to run LLMs locally on your RTX 3050. Because the 3050 Laptop GPU has 4GB of VRAM, you must use quantized models to avoid CUDA Out-of-Memory errors.

### ✅ Supported Models (RTX 3050 / 4GB VRAM Friendly)

| Model | Size | VRAM Usage | Best For |
|-------|------|------------|----------|
| `phi3:mini` | 3.8B (Q4) | ~2.5 GB | ⭐ Best fit - Fast responses, low VRAM |
| `llama3:8b-q4_0` | 8B (Q4) | ~3.8 GB | General purpose, pushes VRAM to the limit |
| `gemma2:2b` | 2B | ~1.5 GB | Ultra-fast, leaves VRAM for other tasks |

> 💡 **Tip:** If you experience system lag, it's because the 8B models push your 16GB system RAM and 4GB VRAM to their limits. Close background applications (like Chrome) before running the 8B models, or stick to the `phi3` model for a smooth experience.

---

## 🎮 Usage

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `q` | Quit |
| `w` | Switch to Watchlist panel |
| `c` | Switch to Chart panel |
| `n` | Switch to News/Sentiment panel |
| `a` | Switch to AI Analysis panel |
| `s` | Search/Add ticker |
| `r` | Refresh data |
| `b` | Open Backtester |
| `?` | Help |

---

## 🔧 Configuration

Edit `.env` to customize your terminal and ensure your RTX 3050 is being utilized (use `.env.example` as a template):

```env
# Data Sources
DEFAULT_DATA_SOURCE=yfinance          
ALPHA_VANTAGE_API_KEY=your_key_here                
FINNHUB_API_KEY=your_key_here                      

# AI Settings (RTX 3050 Optimized)
LLM_PROVIDER=ollama                   
LLM_MODEL=phi3:mini                   # Keep to 4GB VRAM limits
LLM_TEMPERATURE=0.3
GPU_LAYERS=99                         # Offload all layers to RTX 3050

# UI Settings
THEME=dark                            
REFRESH_INTERVAL=5                    
DEFAULT_TICKERS=AAPL,MSFT,GOOGL,TSLA

# Cache (Uses System RAM)
CACHE_ENABLED=true
CACHE_DURATION=3600                   
```

---

## ⚠️ Disclaimer

This tool is for **educational and informational purposes only**. It is **NOT financial advice**. Always do your own research and consult with a licensed financial advisor before making investment decisions. The authors assume no liability for any trading losses or financial decisions made using this software.

# 📄 License