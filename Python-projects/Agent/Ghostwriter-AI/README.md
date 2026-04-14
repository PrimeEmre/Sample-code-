# ✍️ GhostWriter AI

<div align="center">

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=for-the-badge&logo=flask&logoColor=white)
![CrewAI](https://img.shields.io/badge/CrewAI-Multi--Agent-FF4B4B?style=for-the-badge)
![Ollama](https://img.shields.io/badge/Ollama-Local_AI-black?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**An AI-powered ghostwriting platform that researches, writes, and edits full SEO-optimized blog posts using a crew of specialized AI agents.**

[🚀 Live Demo](#) • [📖 Documentation](#installation) • [🐛 Report Bug](https://github.com/PrimeEmre/Ghostwriter-AI/issues) • [✨ Request Feature](https://github.com/PrimeEmre/Ghostwriter-AI/issues)

</div>

---

## 📌 What is GhostWriter AI?

GhostWriter AI is an intelligent content creation platform that combines the power of multi-agent AI workflows with a clean, modern web interface. At its core, it is a ghostwriting tool — meaning it writes on your behalf, in your voice, about any topic you choose. Unlike simple AI chatbots that produce generic responses, GhostWriter AI deploys a specialized crew of three AI agents that work together in sequence: one researches your topic using real-time web search, one writes a full structured blog post based on that research, and one edits and polishes the final output for grammar, tone, and readability. The result is a publication-ready blog post delivered in minutes.

The platform was built for bloggers, content creators, marketers, and business owners who need high-quality written content but do not always have the time or energy to write it themselves. Whether you run a personal blog, manage a company website, or create content for clients, GhostWriter AI removes the blank-page problem entirely. You simply type your topic, choose your tone and length, and let the AI crew do the heavy lifting. Every post is SEO-optimized by design, meaning it is structured with the right headings, keywords, and content depth to perform well in search engines.

What makes GhostWriter AI different from other AI writing tools is its use of CrewAI's multi-agent architecture. Instead of one AI trying to do everything, three specialized agents each focus on what they do best. The SEO Research Specialist digs into current trends, competitor content, and keyword opportunities before a single word is written. The SEO Blog Writer then crafts the post using those insights, ensuring every section is purposeful and engaging. Finally, the Content Editor reviews the draft for quality, consistency, and flow. This pipeline approach produces significantly better output than a single-prompt AI response.

The project is fully open source and built with a practical, real-world stack: Flask handles the backend API, plain HTML, CSS, and JavaScript power the frontend, and python-dotenv keeps your credentials secure. It also includes a bonus stock analysis feature powered by a local Ollama model, allowing users to get AI-generated financial insights on any stock or cryptocurrency without any additional API costs. GhostWriter AI is designed to be easy to run locally, easy to deploy online, and easy to extend with new features over time.

---

## ✨ Features

- 🤖 **3-Agent AI Crew** — Research, Write, and Edit agents work in sequence
- 🔍 **Real-Time Web Research** — Serper API integration for live topic research
- 📝 **SEO-Optimized Output** — Every post is structured for search engine performance
- 🎨 **Tone Selector** — Choose from Professional, Casual, Persuasive, or Storytelling
- 📏 **Length Control** — Short (~700w), Medium (~1500w), or Long (~3000w)
- 📋 **Copy & Download** — One-click copy or download as Markdown
- 💾 **Auto-Save** — Every generated post is saved locally as a `.md` file
- 📈 **Stock Analyzer** — Bonus AI stock analysis powered by local Ollama
- 🌙 **Dark UI** — Clean dark-themed interface with gold accents

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python, Flask |
| Frontend | HTML, CSS, JavaScript |
| AI Agents | CrewAI (Cloud) |
| Local AI | Ollama (`qwen2.5-coder:14b`) |
| Web Search | Serper Dev API |
| Stock Data | yfinance, DuckDuckGo Search |
| Environment | python-dotenv |
| Deployment | Railway / Render |

---

## 🏗️ Project Structure

```
ghostwriter-ai/
│
├── static/
│   ├── style.css          # Dark theme styling
│   └── script.js          # Frontend logic & API calls
│
├── templates/
│   └── index.html         # Main web interface
│
├── posts/                 # Auto-generated blog posts (gitignored)
│
├── app.py                 # Flask backend & CrewAI integration
├── requirements.txt       # Python dependencies
├── .env                   # API keys (gitignored)
├── .gitignore
└── README.md
```

---

## ⚙️ How It Works

```
User types topic
      ↓
Flask receives request (/generate)
      ↓
CrewAI kickoff → 3 agents run in sequence:
  [1] SEO Research Specialist  →  researches topic + keywords
  [2] SEO Blog Writer          →  writes full blog post
  [3] Content Editor           →  polishes grammar + tone
      ↓
Blog post returned to Flask
      ↓
Displayed on screen + saved as .md file
```

---

## 🚀 Installation

### Prerequisites
- Python 3.11+
- [Ollama](https://ollama.com) installed locally
- [CrewAI](https://app.crewai.com) account
- [Serper.dev](https://serper.dev) API key

### 1. Clone the repository
```bash
git clone https://github.com/PrimeEmre/Ghostwriter-AI.git
cd Ghostwriter-AI
```

### 2. Create a virtual environment
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Mac / Linux
source venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Pull the Ollama model
```bash
ollama pull qwen2.5-coder:14b
```

### 5. Set up environment variables
Create a `.env` file in the root folder:
```env
CREWAI_CREW_URL=https://your-crew-name.crewai.com
CREWAI_CREW_TOKEN=your_bearer_token_here
GOOGLE_TTS_KEY=your_google_tts_key_here
```

### 6. Run the app
```bash
python app.py
```

Open your browser and go to:
```
http://127.0.0.1:5000
```

---

## 🔑 Getting Your API Keys

| Key | Where to Get It |
|-----|----------------|
| `CREWAI_CREW_URL` | CrewAI → Your Crew → Deploy → API URL |
| `CREWAI_CREW_TOKEN` | CrewAI → Your Crew → Deploy → Bearer Token |
| `SERPER_API_KEY` | [serper.dev](https://serper.dev) → Dashboard |
| `GOOGLE_TTS_KEY` | [Google Cloud Console](https://console.cloud.google.com) → Text-to-Speech API |

---

## 🖥️ Usage

1. Open the app at `http://127.0.0.1:5000`
2. Type your blog topic in the text area
3. Select your preferred **Tone** (Professional, Casual, Persuasive, Storytelling)
4. Select your preferred **Length** (Short, Medium, Long)
5. Click **✨ Generate Blog Post**
6. Wait 1–3 minutes while the AI crew works
7. Copy or download your finished blog post

---

## 📦 Requirements

```
flask==3.0.0
requests==2.31.0
python-dotenv==1.0.0
duckduckgo-search==6.1.0
yfinance==0.2.38
```

---

## ☁️ Deployment

### Deploy to Railway
1. Push your code to GitHub
2. Go to [railway.app](https://railway.app) and sign in with GitHub
3. Click **New Project** → **Deploy from GitHub repo**
4. Select `Ghostwriter-AI`
5. Add your environment variables in the Railway dashboard
6. Create a `Procfile` with:
```
web: python app.py
```
7. Railway will give you a public URL automatically

---

## 🔒 Security Notes

- Never commit your `.env` file — it is included in `.gitignore`
- Regenerate any API key that was accidentally exposed
- Do not hardcode credentials directly in `app.py`

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👤 Author

**Emre Guzel**

- Website: [emreguzel.ca](https://emreguzel.ca)
- GitHub: [@PrimeEmre](https://github.com/PrimeEmre)

---

<div align="center">

⭐ **If this project helped you, please give it a star!** ⭐

</div>
