# 📣 Social Media Multiplier

<div align="center">

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=for-the-badge&logo=flask&logoColor=white)
![CrewAI](https://img.shields.io/badge/CrewAI-Agentic_Automation-FF4B4B?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**An autonomous content repurposing agent that reads any blog post or website and transforms it into a full suite of platform-ready social media posts — automatically.**

[🚀 Live Demo](#) • [📖 Documentation](#installation) • [🐛 Report Bug](https://github.com/PrimeEmre/Social-Media-Multiplier-local/issues) • [✨ Request Feature](https://github.com/PrimeEmre/Social-Media-Multiplier-local/issues)

</div>

---

## 📌 What is Social Media Multiplier?

**Social Media Multiplier** is an agentic automation tool that eliminates the most time-consuming part of content marketing — repurposing. Most developers and creators write a blog post and then spend hours manually rewriting it for Twitter, LinkedIn, and other platforms. This tool automates that entire process with a two-agent CrewAI pipeline.

You provide a blog URL or a block of text. The tool sends it through a **Content Auditor** (Agent 1) that scrapes and analyzes the content, extracting the key insights, arguments, and talking points. That analysis is then passed to an **Omnichannel Marketer** (Agent 2) who takes those insights and crafts platform-optimized social posts — a punchy 5-part X (Twitter) thread, a professional LinkedIn update, and more — all in one automated run.

The result is a full social media content suite generated from a single source in minutes, not hours.

---

## ✨ Features

- 🌐 **URL-Based Content Ingestion** — Paste any blog or article URL and the agent scrapes the full text automatically using the Firecrawl web scrape tool.
- 📋 **Text Input Support** — No URL? Paste raw content directly and the pipeline works just the same.
- 🤖 **Multi-Agent Pipeline** — A dedicated Content Auditor agent handles research and extraction, while a separate Omnichannel Marketer agent handles creative writing.
- 🐦 **X (Twitter) Thread Generation** — Outputs a structured 5-part thread that is punchy, educational, and ready to post.
- 💼 **LinkedIn Post Generation** — Outputs a professional LinkedIn update tailored to a business and developer audience.
- 🔄 **Sequential Workflow** — CrewAI's sequential process guarantees the content is fully analyzed before any writing begins, preventing hallucinations and off-topic output.
- 🔐 **Secure by Default** — API keys and tokens are managed via `.env` and never hard-coded.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Python, Flask |
| **AI Orchestration** | CrewAI Enterprise / Cloud |
| **LLM** | GPT-4o-mini (via CrewAI) |
| **Web Scraping** | Firecrawl, Read a website content tool |
| **Environment** | python-dotenv |

---

## 🧠 How It Works

```text
User Input (Blog URL or raw text)
        │
        ▼
Agent 1: Content Auditor
→ Scrapes the URL using Firecrawl
→ Extracts key insights, arguments, and talking points
→ Produces a structured content brief
        │
        ▼
Agent 2: Omnichannel Marketer
→ Reads the content brief from Agent 1
→ Writes a 5-part X (Twitter) thread
→ Writes a professional LinkedIn update
        │
        ▼
Output: Platform-ready social media posts
```

The sequential pipeline means Agent 2 never starts until Agent 1 has fully completed its analysis. This keeps the output grounded in the actual source content.

---

## 🏗️ Project Structure

```text
social-media-multiplier/
│
├── static/
│   ├── style.css          # UI theme
│   └── script.js          # Frontend logic
│
├── templates/
│   └── index.html         # Main dashboard
│
├── app.py                 # Flask server & CrewAI kickoff logic
├── requirements.txt       # Project dependencies
├── .env                   # Secret keys (never commit this)
└── README.md
```

---

## 🚀 Installation

### Prerequisites

- Python 3.11+
- A [CrewAI](https://crewai.com) account with an API token
- A [Firecrawl](https://firecrawl.dev) API key for web scraping

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/PrimeEmre/Social-Media-Multiplier-local.git
cd Social-Media-Multiplier-local
```

2. **Install dependencies**

```bash
pip install -r requirements.txt
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
CREWAI_CREW_URL=your_crewai_crew_url/api/v1
CREWAI_CREW_TOKEN=your_crewai_bearer_token
FIRECRAWL_API_KEY=your_firecrawl_api_key
```

4. **Run the application**

```bash
python app.py
```

5. Open your browser and navigate to `http://localhost:5000`

---

## 📖 Usage

1. Open the dashboard at `http://localhost:5000`
2. Paste a blog post URL or raw content text into the input field
3. Select your preferred tone and output length
4. Click **Generate Posts**
5. Copy the generated X thread and LinkedIn post and publish them directly

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Check the [issues page](https://github.com/PrimeEmre/Social-Media-Multiplier-local/issues).

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


<div align="center">

Made with ❤️ by [PrimeEmre](https://github.com/PrimeEmre)

</div>
