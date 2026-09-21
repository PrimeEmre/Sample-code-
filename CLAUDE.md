# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository nature

This is **not a single application** — it's a personal collection of independent, standalone learning/tutorial projects paired with a blog (blog.emreguzel.ca) and portfolio (emreguzel.ca). Each top-level folder is its own isolated project with its own language, dependencies, and (sometimes) run instructions. There is no shared build system, package manifest, or test suite spanning the repo. When asked to work on "the project," first identify which subfolder is actually in scope — check the currently open file's path and work only within that project's directory.

See [README.md](README.md) for the full folder-to-blog-post mapping.

## Structure

- `C-Programing/` — standalone C exercises. Compile per-file with gcc (e.g. `gcc ./main.c -o main.exe`), no Makefile/build system.
- `Python-projects/` — multiple independent Python scripts and small AI-agent projects, each in its own subfolder:
  - `Agent/`, `Agets-part-2/` — AI agent tutorial projects (per-subfolder scripts, not a shared package). Folder names ending in `--local` or `-local` denote agents meant to run against local models rather than cloud APIs.
  - `Python-AI-Projects/`, `Tkinter/`, `Python-module/`, `Basics-Of-Python/` — beginner/tutorial scripts, each with its own `main.py`.
  - Each subproject may have its own dependencies; there is no repo-wide `requirements.txt` — check inside the specific subfolder.
- `Agent_with_Hardware/` — AI agents integrated with physical hardware (Arduino, sensors):
  - `Jarvis-Hardware-Program--local/` — CrewAI + local LLM + local TTS agent driving Arduino hardware; has its own `README.md`, `AGENTS.md`, and `CLAUDE.md` — read those before working in this subfolder, they take precedence for that project.
  - `The-Hardware-Integrated-AI-Pomodoro-Manager--local/` — pairs a Python controller (`main.py`) with an Arduino sketch (`hardware.ino`).
- `Javascript-projects/` — static HTML/CSS/JS tutorial sites (API usage, user input mini-projects, a first-website walkthrough). Open the relevant `index.html` directly; no bundler/build step.
- `professional_website/`, `my_first_webpage/` — static portfolio/tutorial websites (plain HTML/CSS/JS, some Sass under `professional_website/assets/sass`).
- `maze_game/` — a Unity project (3D maze game tutorial). Open via Unity Editor, not from the command line; `Assets/`, `Scenes/`, and `.sln`/`.csproj` files are Unity-generated.
- Root-level image/GIF files — sample assets used by Python image-processing exercises (rotation, thumbnailing, animation), not app resources.
- `histories/` — saved conversation/session exports, not source code.

## Working conventions

- Projects with folder names ending in `-local`/`--local` are designed to run fully locally (local LLMs, local TTS, no cloud calls) — don't introduce cloud API dependencies into them without checking with the user first.
- Several Python agent subfolders contain `.env` files with local configuration/secrets — never read, print, or commit contents of `.env` files.
- Since each subfolder is independent, always check for a subfolder-specific `README.md`, `AGENTS.md`, or `CLAUDE.md` before making changes there — those override this top-level file for their own directory.
