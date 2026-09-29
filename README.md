# 🚀 Sample Projects Collection

**Languages**

![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)
![C](https://img.shields.io/badge/C-A8B9CC?logo=c&logoColor=black)
![C++](https://img.shields.io/badge/C%2B%2B-00599C?logo=cplusplus&logoColor=white)
![C#](https://img.shields.io/badge/C%23-512BD4?logo=dotnet&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css&logoColor=white)
![Sass](https://img.shields.io/badge/Sass-CC6699?logo=sass&logoColor=white)

**Tools & Platforms**

![Unity](https://img.shields.io/badge/Unity-000000?logo=unity&logoColor=white)
![Arduino](https://img.shields.io/badge/Arduino-00878F?logo=arduino&logoColor=white)

The central repository for my coding experiments, AI-driven scripts, and web development projects. It hosts the official source code for the tutorials published on my [technical blog](https://blog.emreguzel.ca/) and [portfolio](https://emreguzel.ca/).

This workspace documents my journey as a frontend designer and developer. It mixes production-ready code, learning exercises, and media assets used for image processing and animation experiments.

> **Note:** Every top-level folder is an **independent project** with its own language and dependencies. There is no shared build system — open the folder for the tutorial you're following and start there.

---

## 📑 Table of Contents

- [Repository Structure](#repository-structure)
- [Projects](#projects)
  - [AI Agents & Hardware Integration](#ai-agents)
  - [Python & AI](#python-ai)
  - [C Programming](#c-programming)
  - [JavaScript](#javascript)
  - [Unity & Game Design](#unity)
  - [Web Design & Portfolios](#web-design)
- [Media & Image Processing](#media)
- [Getting Started](#getting-started)
- [Learn More & Connect](#connect)

---

<a id="repository-structure"></a>
## 🗂️ Repository Structure

```text
Sample-code-/
├── Agent_with_Hardware/          # AI agents that drive physical hardware (Arduino)
│   ├── Jarvis-Hardware-Program--local/
│   └── The-Hardware-Integrated-AI-Pomodoro-Manager--local/
├── Python-projects/
│   ├── Agent/                    # AI Agents — Part 1
│   ├── Agets-part-2/             # AI Agents — Part 2 (local models)
│   ├── Python-AI-Projects/       # Book agent, chatbot, web agent, Jarvis text bot
│   ├── Tkinter/                  # GUI tutorial
│   ├── Python-module/            # Modules & image processing
│   └── Basics-Of-Python/         # Beginner fundamentals
├── C-Programing/                 # Intro to C (main.c, BasicOfC/, UserInput/)
├── Javascript-projects/          # API sites, user-input mini projects, first JS site
├── maze_game/                    # Unity 3D maze game
├── professional_website/         # Portfolio website (HTML/CSS/Sass)
├── my_first_webpage/             # First HTML/CSS webpage
└── *.jpg / *.gif / *.png         # Sample media for image-processing exercises
```

> Folders ending in `-local` / `--local` run **fully offline** using local LLMs and local text-to-speech — no cloud APIs required.

---

<a id="projects"></a>
## 📂 Projects

<a id="ai-agents"></a>
### 🔌 AI Agents & Hardware Integration

| Project | Folder | Blog Post |
|---|---|---|
| **J.A.R.V.I.S. Hardware Agent** — Arduino + CrewAI + local LLM + local TTS | [`Jarvis-Hardware-Program--local`](./Agent_with_Hardware/Jarvis-Hardware-Program--local/) | [Architecting Autonomous AI Agents with Hardware Integration](https://blog.emreguzel.ca/2026/07/19/architecting-autonomous-ai-agents-with-hardware-integration/) |
| **AI Pomodoro Manager** — Python controller paired with an Arduino sketch | [`The-Hardware-Integrated-AI-Pomodoro-Manager--local`](./Agent_with_Hardware/The-Hardware-Integrated-AI-Pomodoro-Manager--local/) | — |

#### Creating AI Agents in Python: Part 2
🔗 [Blog Post](https://blog.emreguzel.ca/2026/04/19/creating-ai-agents-python-part-2/) · 📁 [`/Python-projects/Agets-part-2/`](./Python-projects/Agets-part-2/)

| Sub-Project | Description |
|---|---|
| 🛡️ [`The-Tech-Security-Threat-Briefing--local`](./Python-projects/Agets-part-2/The-Tech-Security-Threat-Briefing--local) | Local, privacy-focused threat intelligence tool |
| 🚨 [`Hardware-Integrated-Threat-Monitor--local`](./Python-projects/Agets-part-2/Hardware-Integrated-Threat-Monitor--local) | Real-time local hardware anomaly detection and threat monitoring |
| 🤖 [`GitHub-Code-Explainer---local`](./Python-projects/Agets-part-2/GitHub-Code-Explainer---local) | Local AI agent that analyzes and explains codebases |
| 📈 [`The-Stock-Intelligence-Terminal---Local---PC--local`](./Python-projects/Agets-part-2/The-Stock-Intelligence-Terminal---Local---PC--local) | AI-driven financial market tracker (PC optimized) |
| 💻 [`The-Stock-Intelligence-Terminal--laptop---local`](./Python-projects/Agets-part-2/The-Stock-Intelligence-Terminal--laptop---local) | AI-driven financial market tracker (laptop / low-VRAM optimized) |
| 📱 [`Social-Media-Multiplier-local`](./Python-projects/Agets-part-2/Social-Media-Multiplier-local) | Local automated content distribution tool |

#### Creating Agents: A Complete Guide (Part 1)
🔗 [Blog Post](https://blog.emreguzel.ca/2026/03/16/creating-agents/) · 📁 [`/Python-projects/Agent/`](./Python-projects/Agent/)

| Sub-Project | Description |
|---|---|
| 🤖 [`Code-AI-Agent-code`](./Python-projects/Agent/Code-AI-Agent-code) | Automated coding companion and script generation |
| 📉 [`Crypto-Stock-Price-Predictor`](./Python-projects/Agent/Crypto-Stock-Price-Predictor) | Predictive intelligence terminal for crypto market tracking |
| ✍️ [`Ghostwriter-AI`](./Python-projects/Agent/Ghostwriter-AI) | Generative writing engine for creative content workflows |

<a id="python-ai"></a>
### 🐍 Python & AI

| Tutorial | Folder | Blog Post |
|---|---|---|
| **How to Make an AI in Python (Book Agent)** | [`Python-AI-Projects`](./Python-projects/Python-AI-Projects/) | [Read](https://blog.emreguzel.ca/how-to-make-ai-in-python) |
| **How to Make a Tkinter Project** | [`Tkinter`](./Python-projects/Tkinter/) | [Read](https://blog.emreguzel.ca/2026/01/02/python-modules-the-ultimate-guide/) |
| **Basics of Python & Stock Trackers** | [`Basics-Of-Python`](./Python-projects/Basics-Of-Python/) · [`Python-module`](./Python-projects/Python-module/) | [Read](https://blog.emreguzel.ca/2025/12/15/learn-python-for-beginners/) |

Sub-projects inside `Python-AI-Projects`: [`AI-Web-Agent`](./Python-projects/Python-AI-Projects/AI-Web-Agent/), [`Audio-Book-Agent`](./Python-projects/Python-AI-Projects/Audio-Book-Agent/), [`Bulding-Chatbot-In-Website-`](./Python-projects/Python-AI-Projects/Bulding-Chatbot-In-Website-/), [`Jarvis_Text_Bot`](./Python-projects/Python-AI-Projects/Jarvis_Text_Bot/).

<a id="c-programming"></a>
### 🖥️ C Programming

🔗 [Introduction to C Programming](https://blog.emreguzel.ca/2026/09/17/introduction-to-c-programming/) · 📁 [`/C-Programing`](./C-Programing/)

| File | Topics |
|---|---|
| [`main.c`](./C-Programing/main.c) | Constants and formatted output (job title & salary program) |
| [`BasicOfC/main.c`](./C-Programing/BasicOfC/main.c) | Hello World, printing, arithmetic, variables, and strings |
| [`UserInput/main.c`](./C-Programing/UserInput/main.c) | Reading user input with `scanf` (rectangle area calculator) |

<a id="javascript"></a>
### 🎨 JavaScript

| Tutorial | Folders | Blog Post |
|---|---|---|
| **Websites Using APIs** | [`Advenced-API-projects`](./Javascript-projects/Advenced-API-projects/) · [`Javascript-API-Projects`](./Javascript-projects/Javascript-API-Projects/) | [Read](https://blog.emreguzel.ca/2025/12/06/how-to-make-webistes-using-api/) |
| **User Input & Mini Projects** | [`Advenced-userInput-projects`](./Javascript-projects/Advenced-userInput-projects/) · [`basic-userInput-projects`](./Javascript-projects/basic-userInput-projects/) | [Read](https://blog.emreguzel.ca/2025/10/13/javascript-mini-projects-for-beginners/) |
| **First JS Website Build** | [`my-first-javascript-website`](./Javascript-projects/my-first-javascript-website/) | [Read](https://blog.emreguzel.ca/2025/10/12/take-your-web-development-skills-to-the-next-level-this-guide-teaches-you-how-to-build-a-website-from-scratch-using-html-css-and-the-power-of-javascript-for-interactivity-a-beginners-guide-to-cr/) |

<a id="unity"></a>
### 🎮 Unity & Game Design

📁 [`/maze_game`](./maze_game/)

| Tutorial | Key Files | Blog Post |
|---|---|---|
| **3D Maze Game Build** | [`BallController.cs`](./maze_game/BallController.cs) · [`tutorial 3.1.sln`](./maze_game/tutorial%203.1.sln) | [Read](https://blog.emreguzel.ca/2025/08/21/program-a-game-in-unity/) |
| **Mini Projects & Installation** | [`Assets`](./maze_game/Assets/) · [`Scenes`](./maze_game/Scenes/) | [Read](https://blog.emreguzel.ca/2025/08/13/how-to-use-unity-with-right-installations/) |

<a id="web-design"></a>
### 💼 Web Design & Portfolios

| Tutorial | Key Files | Blog Post |
|---|---|---|
| **Professional Website Build** | [`professional_website/index.html`](./professional_website/index.html) | [Read](https://blog.emreguzel.ca/2025/09/27/learn-web-design-how-to-build-your-first-professional-website/) |
| **HTML & CSS Foundations** | [`chess.html`](./professional_website/chess.html) · [`coding.html`](./professional_website/coding.html) · [`vedio_game.html`](./professional_website/vedio_game.html) | [Read](https://blog.emreguzel.ca/2025/09/10/how-to-make-a-website-with-html-and-css/) |
| **Your First Webpage** | [`my_first_webpage/index.html`](./my_first_webpage/index.html) | [Read](https://blog.emreguzel.ca/2025/08/27/how-to-make-your-first-webpage/) |

---

<a id="media"></a>
## 🖼️ Media & Image Processing

Sample assets in the **root directory**, used by the Python image-processing exercises (rotation, thumbnails, animation):

| Asset | Purpose |
|---|---|
| [`billgates.jpg`](./billgates.jpg) | Original source image |
| [`rotated_billgates_90.jpg`](./rotated_billgates_90.jpg) · [`180`](./rotated_billgates_180.jpg) · [`270`](./rotated_billgates_270.jpg) · [`360`](./rotated_billgates_360.jpg) | Rotation output |
| [`animated_billgates.gif`](./animated_billgates.gif) | Animation output |
| [`billgates_card.jpg`](./billgates_card.jpg) | Card / composite output |
| [`og_image_generator.png`](./og_image_generator.png) | Open Graph image generator output |

---

<a id="getting-started"></a>
## 🛠️ Getting Started

**1. Clone the repository**

```bash
git clone https://github.com/PrimeEmre/Sample-code-.git
cd Sample-code-
```

**2. Open the project you want to run.** Each folder is self-contained; if it has its own `README.md`, follow that first.

| Type | How to run |
|---|---|
| **Python** | `cd` into the project folder, install its `requirements.txt` if present (`pip install -r requirements.txt`), then run `python main.py` |
| **C** | In a Visual Studio Developer Command Prompt: `cl main.c` then `main.exe` (or use VS Code's default build task) |
| **JavaScript / HTML** | Open the folder's `index.html` in your browser — no build step needed |
| **Unity** | Open `maze_game/` from Unity Hub |
| **Arduino** | Upload the `.ino` sketch with the Arduino IDE, then run the paired Python controller |

---

<a id="connect"></a>
## 🔗 Learn More & Connect

- 🌐 **Portfolio:** [emreguzel.ca](https://emreguzel.ca/)
- ✍️ **Technical Blog:** [blog.emreguzel.ca](https://blog.emreguzel.ca/)
- 🖥️ **GitHub:** [@PrimeEmre](https://github.com/PrimeEmre)
