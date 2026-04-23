# 🛠️ GitHub Code Explainer

<div align="center">

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=for-the-badge&logo=flask&logoColor=white)
![CrewAI](https://img.shields.io/badge/CrewAI-Agentic_Automation-FF4B4B?style=for-the-badge)
![GitHub API](https://img.shields.io/badge/GitHub_API-V3-181717?style=for-the-badge&logo=github)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**An autonomous developer relations agent that monitors your GitHub commits and transforms raw code changes into professional, human-readable technical blog posts.**

[🚀 Live Demo](#) • [📖 Documentation](#installation) • [🐛 Report Bug](https://github.com/PrimeEmre/GitHub-Code-Explainer---local/issues) • [✨ Request Feature](https://github.com/PrimeEmre/GitHub-Code-Explainer---local/issues)

</div>

---

## 📌 What is GitHub Code Explainer?

**GitHub Code Explainer** is an agentic automation tool designed to bridge the gap between *coding* and *documenting*. For many developers, keeping a technical blog (DevLog) updated is a chore that takes time away from actual building. This project solves that by deploying a specialized crew of AI agents that act as your personal technical writer.

When you push code to a repository, this tool fetches the specific **diff** (what changed) and the commit message. It then hands that data to a **Technical Code Analyst** (Agent 1) who breaks down the logic of the changes. Finally, a **DevLog Writer** (Agent 2) takes that analysis and crafts a narrative-driven blog post — explaining not just *what* changed, but *why* it matters to the project.

By utilizing **CrewAI's** sequential workflow, the tool ensures that technical details are verified before creative writing begins. This prevents hallucinations and produces high-quality content that reads like it was written by the lead developer.

---

## ✨ Features

- 🔄 **GitHub Commit Integration** — Automatically pulls the latest commit diffs and messages via the REST API.
- 🤖 **Multi-Agent Pipeline** — Dedicated agents for technical analysis and creative writing, each with a focused role.
- 📊 **Agentic Logic** — High-fidelity explanations of code logic, not just file names.
- 📝 **Markdown Native** — Outputs are perfectly formatted for WordPress, Ghost, or any static site generator.
- 🎨 **Professional UI** — Dark-themed dashboard with glassmorphism design and real-time execution tracking.
- 🔐 **Private & Secure** — Uses Personal Access Tokens (PAT) and `.env` files for secure repository access.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Python, Flask |
| **Frontend** | HTML5, CSS3 (Glassmorphism), JavaScript |
| **AI Orchestration** | CrewAI Enterprise / Cloud |
| **LLM** | GPT-4o-mini (via CrewAI) |
| **Data Sourcing** | GitHub REST API v3 |
| **Environment** | python-dotenv |

---

## 🏗️ Project Structure

```text
github-code-explainer/
│
├── static/
│   ├── style.css          # "Midnight & Gold" UI theme
│   └── script.js          # AJAX calls and Agent Stepper logic
│
├── templates/
│   └── index.html         # Main Automation Dashboard
│
├── github_fetcher.py      # GitHub REST API integration
├── app.py                 # Flask server & CrewAI kickoff logic
├── requirements.txt       # Project dependencies
├── .env                   # Secret keys (GITHUB_TOKEN, CREWAI_TOKEN)
└── README.md
```

---

## 🚀 Installation

### Prerequisites

- Python 3.11+
- A [CrewAI](https://crewai.com) account with an API token
- A GitHub Personal Access Token (PAT) with `repo` read permissions

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/PrimeEmre/GitHub-Code-Explainer---local.git
cd GitHub-Code-Explainer---local
```

2. **Install dependencies**

```bash
pip install -r requirements.txt
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
GITHUB_TOKEN=your_github_personal_access_token
CREWAI_TOKEN=your_crewai_api_token
```

4. **Run the application**

```bash
python app.py
```

5. Open your browser and navigate to `http://localhost:5000`

---

## 🧠 How It Works

```
GitHub Commit
      │
      ▼
  Fetch Diff & Commit Message (github_fetcher.py)
      │
      ▼
  Agent 1: Technical Code Analyst
  → Reads the diff, identifies patterns, explains logic
      │
      ▼
  Agent 2: DevLog Writer
  → Transforms analysis into a narrative blog post
      │
      ▼
  Markdown Output (ready to publish)
```

The two-agent sequential pipeline ensures accuracy before creativity. The analyst grounds the output in real code changes, while the writer shapes it into compelling content.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/PrimeEmre/GitHub-Code-Explainer---local/issues).

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">

Made with ❤️ by [PrimeEmre](https://github.com/PrimeEmre)

</div>
