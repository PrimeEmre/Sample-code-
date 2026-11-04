# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the App

```bash
# Install dependencies
pip install -r requirements.txt

# Run locally
python app.py
# Starts Flask on http://localhost:5005
```

**Z.ai API key must be set** in `.env` before the AI endpoint works:
```
ZAI_API_KEY=your_key_here
ZAI_MODEL=glm-4.5-air   # optional, this is the default
```

Docker:
```bash
docker build -t ibochat .
docker run -p 5005:5005 ibochat
```

## Architecture

Single-file Flask backend ([app.py](app.py)) serving both HTML pages and a JSON API. No session-based auth — login/register are stateless API calls; the frontend stores login state in `localStorage`.

**Key services:**
- **AI chat** — `POST /api/gemini` proxies to Z.ai (`open.bigmodel.cn`) using the GLM model. The endpoint name is legacy (was originally Google Gemini). Includes 3-retry logic with exponential backoff on 429s. Response is a plain-text streaming response (not Gemini-shaped JSON).
- **Text-to-Speech** — `GET /speak?text=...&language=...&gender=...&voice_id=...` tries up to three paths in order:
  - **GPT-SoVITS fast path** (English-only celebrities): if `voice_id` is one of the 10 IDs hardcoded in `GPT_SOVITS_VOICE_MAP` ([app.py](app.py#L202)) — Trump, Obama, Biden, Musk, Gates, Freeman, Arnold, Reeves, Jack Ma, Ronaldo — routes to a GPT-SoVITS server (`GPT_SOVITS_URL`, default `http://localhost:9880`) instead of OmniVoice, since it's ~5-18s vs OmniVoice's ~30-40s+ for the languages it supports (English/Chinese/Japanese/Korean/Cantonese only — that's why it isn't used for everyone). Each entry pairs a short reference clip (`GPT_SOVITS_VOICE_REFS_DIR`) with an accurate transcript as `prompt_text` — an empty prompt_text measurably hurts cloning quality. GPT-SoVITS has no idle-unload of its own and permanently holds ~3.9GB VRAM once started, which starved a 4GB GPU's OmniVoice down to corruption — so by default (`GPT_SOVITS_MANAGED=1`) Flask starts it on-demand via subprocess and a watchdog thread kills it after `GPT_SOVITS_IDLE_TIMEOUT_S` (120s) of disuse, mirroring OmniVoice's own behavior. Before each GPT-SoVITS call, OmniVoice's own memory is flushed via `/system/flush-memory` to reduce contention further. Set `GPT_SOVITS_MANAGED=0` if GPT-SoVITS is hosted on a separate machine — this disables the local subprocess-launching entirely and just calls `GPT_SOVITS_URL` directly.
  - **OmniVoice celebrity voice** (everyone else with a `voice_id`): routes through OmniVoice Studio (`OMNIVOICE_URL`, default `http://localhost:3900`, [app.py:186](app.py#L186)). Returns audio over HTTP via OmniVoice's OpenAI-compatible `/v1/audio/speech` endpoint. OmniVoice Studio runs separately as a standalone desktop app (Tauri-based, `com.debpalash.omnivoice-studio`) which manages its own backend process on port 3900 — `start.bat` is a stale leftover from an earlier setup and is not how OmniVoice actually gets started; if the desktop app isn't running/finished loading its model onto CUDA, `/profiles` and `/v1/audio/speech` just refuse the connection. On any OmniVoice error, silently falls back to Edge TTS.
  - **Edge TTS fallback**: streams MP3 via Microsoft Edge Neural TTS (`edge-tts` package). No API key required. Supports 24 languages; voice resolved from 2-letter lang code + gender via `EDGE_VOICE_MAP` in [app.py](app.py#L29). Runs in a background thread bridged to Flask via `queue.Queue`.
  - **Known ceiling, not a bug**: this whole pipeline assumes one GPU serving one user at a time. Concurrent requests from multiple real users will contend for the same VRAM the same way OmniVoice and GPT-SoVITS contend with each other locally — there is no request queue or multi-tenancy here. Don't "fix" this by tuning timeouts further; it needs either a bigger/multiple GPUs with real queueing, or swapping the voice backend for a hosted multi-tenant API.
- **Celebrity voice management** — `GET /api/voices` lists OmniVoice profiles. `POST /api/voices/auto-create` clones a voice profile: checks `CELEBRITY_VOICE_SOURCES` ([app.py:214](app.py#L214)) for a curated YouTube clip first (specific video id/timestamp per person, picked for clean solo speech), else falls back to a language-aware `yt-dlp` search (`SEARCH_PHRASES`). Downloads via `yt-dlp`, trims with `ffmpeg`, then POSTs the clip to OmniVoice's `/profiles` endpoint. Clipped audio is cached in `voice_cache/` (gitignored) so repeat requests for the same name skip the download. Requires `yt-dlp`, `ffmpeg`, and OmniVoice Studio all available on PATH/running.
- **Auth** — `POST /register` and `POST /login` (also available at `/api/register`, `/api/login`). Email/password stored in `ibochat.db` (SQLite, auto-created on startup via `init_db()`). Passwords hashed with Werkzeug. No sessions/tokens — the frontend just remembers login state in `localStorage`. (`kullanicilar.db` at repo root is an unused leftover from an earlier version — `app.py` only ever touches `ibochat.db`.)

**Templates and static assets are the source of truth; root-level duplicates are stale.** Flask serves pages from `templates/` (`index.html`, `Login.html`, `register.html`, `chat.html`, `ibochatbot.html`) and assets from `static/css/` and `static/JS/`. The repo root also has `login.html` and a top-level `js/` directory left over from an earlier layout — Flask does not serve these; edit the copies under `templates/` and `static/JS/` instead.

## Environment

`.env` is loaded via `python-dotenv`. Required/optional vars:

| Variable | Required | Default |
|---|---|---|
| `ZAI_API_KEY` | Yes | `""` |
| `ZAI_MODEL` | No | `glm-4.5-air` |
| `SECRET_KEY` | No | `ibochat_secret_123` |
| `OMNIVOICE_URL` | No | `http://localhost:3900` |
| `GPT_SOVITS_URL` | No | `http://localhost:9880` |
| `GPT_SOVITS_MANAGED` | No | `1` — set to `0` if GPT-SoVITS runs on a different machine than this Flask process (disables local subprocess start/stop, just calls `GPT_SOVITS_URL`) |
| `GPT_SOVITS_DIR` | Only if `GPT_SOVITS_MANAGED=1` | `C:\Users\emre\GPT-SoVITS` — must point at wherever the GPT-SoVITS repo actually lives |
| `GPT_SOVITS_VENV_PYTHON` | No | `<GPT_SOVITS_DIR>\.venv\Scripts\python.exe` |
| `GPT_SOVITS_FFMPEG_BIN` | Only if `GPT_SOVITS_MANAGED=1` | `C:\Users\emre\ffmpeg-shared\ffmpeg-9.0.1-full_build-shared\bin` — GPT-SoVITS's `torchcodec` dependency needs the *shared* FFmpeg build specifically, not a static one |
| `GPT_SOVITS_VOICE_REFS_DIR` | No | `C:\Users\emre\GPT-SoVITS\voice_refs` |

All of the `GPT_SOVITS_*` path variables default to this one developer's machine and **must** be overridden via `.env` (or real env vars) on any other machine — see [app.py:196](app.py#L196).
