# AGENTS.md

## Project

A personal collection of independent learning/tutorial projects — source code for the tutorials on blog.emreguzel.ca and the emreguzel.ca portfolio — **not a single application**. Each top-level folder is its own isolated project with its own language, dependencies, and run instructions. There is no shared build system, package manifest, or test suite spanning the repo. When asked to work on "the project," first identify which subfolder is actually in scope (check the currently open file's path) and work only within that project's directory. See [README.md](README.md) for the folder-to-blog-post mapping.

## Commands

No repo-wide build, test, or lint. Run everything from inside the specific project folder. There are no test suites or linters configured anywhere in the repo.

Compile and run a C exercise (from a Visual Studio Developer Command Prompt so `cl.exe` is on PATH — same as the default VS Code build task in `.vscode/tasks.json`):

```
cl /Zi /EHsc /nologo /Fe<name>.exe <file>.c
<name>.exe
```

Run a Python project (only install a `requirements.txt` if one exists in that subfolder — only `Ghostwriter-AI` and `GitHub-Code-Explainer---local` have one; there is no repo-wide requirements file):

```
pip install -r requirements.txt
python main.py
```

- JavaScript/HTML projects: open the folder's `index.html` in a browser — no bundler or build step.
- Unity (`maze_game/`): open the folder from Unity Hub; do not build or run it from the command line.
- Arduino: upload the `.ino` sketch with the Arduino IDE, then run the paired Python controller.

## Layout

- `C-Programing/` — standalone C exercises (`BasicOfC/main.c`, `UserInput/main.c`), each file its own program; no Makefile.
- `Python-projects/` — independent Python scripts and AI-agent projects, one subfolder each: `Agent/` and `Agets-part-2/` (AI-agent tutorials; the "Agets" misspelling is the real folder name), `Python-AI-Projects/`, `Tkinter/`, `Python-module/`, `Basics-Of-Python/` (beginner/tutorial scripts, each with its own `main.py`).
- `Agent_with_Hardware/` — agents that drive physical hardware: `Jarvis-Hardware-Program--local/` (Flask + CrewAI + local LLM/TTS + Arduino; has its own `AGENTS.md`, `CLAUDE.md`, and `README.md` — read them before working there, they take precedence) and `The-Hardware-Integrated-AI-Pomodoro-Manager--local/` (Python `main.py` paired with `hardware.ino`).
- `Javascript-projects/` — static HTML/CSS/JS tutorial sites (API projects, user-input mini projects, first JS website).
- `professional_website/`, `my_first_webpage/` — static portfolio/tutorial sites; Sass sources live under `professional_website/assets/sass`.
- `maze_game/` — Unity 3D maze tutorial; `Assets/`, `Scenes/`, and the `.sln`/`.csproj` files are Unity-generated.
- Root-level image/GIF files — sample assets used by Python image-processing exercises (rotation, thumbnails, animation), not app resources.
- `histories/` — saved conversation/session exports, not source code.

## Conventions

- Folders ending in `-local`/`--local` are designed to run fully locally (local LLMs, local TTS, no cloud calls) — don't introduce cloud API dependencies into them without checking with the user first.
- Always check for a subfolder-specific `README.md`, `AGENTS.md`, or `CLAUDE.md` before making changes there — those override this file for their own directory.
- Commit messages are short, informal one-liners (see `git log`); there is no conventional-commit format.
- The blog is the companion to this code: if a tutorial folder gains a new behavior, the README's project tables are where the mapping lives — keep them consistent.

## Gotchas

- The root `.gitignore` only covers C build outputs and `maze_game/obj/`. It does not exclude `venv`s, `__pycache__`, Unity `Temp/`, or `.env` files — check `git status` before committing.
- Many agent subfolders (under `Python-projects/` and `Agent_with_Hardware/`) contain `.env` files, and several are already tracked in git. Never read, print, or modify their contents, and don't stage changes to them.
- `cl.exe` is only on PATH inside a Visual Studio Developer Command Prompt; the VS Code build task also runs a "Close old run of the program" taskkill step before compiling.
- C build outputs (`.exe`/`.obj`/`.pdb`/`.ilk`) are gitignored; leftover ones in the working tree are safe to ignore.
