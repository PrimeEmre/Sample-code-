# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Jarvis Hardware Program is a Flask + Flask-SocketIO web app that acts as a voice-and-chat
"J.A.R.V.I.S." assistant: it answers questions via a local Ollama LLM (grounded with live DDGS
web search, optionally a CrewAI crew), speaks replies through a local OmniVoice Studio TTS
server, and drives a physical Arduino (LEDs + servo) to visualize its state in real time.

There is a single Flask process (`app.py`) serving both the web UI and the hardware control
logic — there is no separate backend/frontend split beyond templates/static files.

## Running the app

There is no `requirements.txt`/`pyproject.toml` in the repo — dependencies must be installed
manually. `app.py` imports: `flask`, `flask-socketio`, `python-dotenv`, `requests`, `pyserial`,
`ddgs`.

```bash
pip install flask flask-socketio python-dotenv requests pyserial ddgs
python app.py                    # serves on http://localhost:5000
```

Configuration lives in `.env` (see keys in `AGENTS.md`'s Configuration section — CrewAI URL/token,
`ARDUINO_PORT`, Ollama/OmniVoice URLs). `.env` is loaded with `override=True`, so real environment
variables never shadow it.

### Testing hardware in isolation

```bash
python test_connection.py
```

Connects directly to the Arduino (bypassing Flask) and cycles through all four states, 4 seconds
each, to verify LED/servo wiring without starting the full app.

There is no automated test suite (no pytest, no CI config) — `test_connection.py` is a manual,
interactive hardware check, not a unit test.

### Arduino firmware

`jarvis_haedware/jarvis_hardware.ino` (note: directory name is misspelled "haedware", not a typo
to fix casually — matches what's referenced elsewhere) must be uploaded to the board separately
via the Arduino IDE/CLI; nothing in this repo does that automatically.

## Architecture

```
┌─ app.py (single Flask process)
│  ├─ Flask-SocketIO         → pushes {'state': ...} to the browser in real time
│  ├─ Ollama (local LLM)     → GPU-tier-selected model answers /chat requests
│  ├─ DDGS web search        → grounds answers; also the CrewAI fallback
│  ├─ CrewAI (optional)      → if CREWAI_CREW_URL set, kicks off a crew and polls
│  │                            for its result instead of the direct DDGS path
│  ├─ OmniVoice Studio (TTS) → local OpenAI-compatible server, auto-launched
│  │                            if not already running; /tts route hits it
│  └─ Arduino serial link    → trigger_hardware_state() writes 1-char signals
├─ templates/index.html + static/script.js + static/style.css  → chat UI, orb/LED
│  status widgets, SocketIO client, audio playback for TTS responses
└─ jarvis_haedware/jarvis_hardware.ino → firmware reading the 1-char signals
```

### Request flow for `/chat`

1. Rate limit check (`RateLimiter`, 10 req/60s per client IP) → 429 if exceeded.
2. Sanitize input, hash it, check `LRUCache` (1h TTL, 128 entries) → return cached reply if hit.
3. `trigger_hardware_state("researching")` — emits SocketIO update + Arduino signal `"B"`.
4. `topic_specific_search()` (DDGS) or `crewai_research()` gathers context.
5. `trigger_hardware_state("debating")` — signal `"Y"`.
6. `ollama_chat()` calls the local model with the search context injected as a system message.
7. `trigger_hardware_state("complete")` in a `finally` block — signal `"W"`, always fires even on
   failure, so the UI/hardware never gets stuck mid-state.
8. Reply cached and returned; `ollama_chat()` returning `None` (vs. an apology string) is what
   lets the cache tell a real failure apart from a real answer — see the comment in `app.py`.

### Hardware state signals

Single ASCII characters written to the serial port; the Arduino sketch and `app.py`'s
`trigger_hardware_state()` must stay in sync on these:

| Signal | State | Arduino behavior |
|--------|-------|-------------------|
| `0` | idle | LEDs off, servo parked at 90° |
| `B` | researching | Blue LED (pin 12) pulses every 400ms, servo sweeps |
| `Y` | debating | Yellow LED (pin 13) pulses every 200ms, servo sweeps |
| `W` | complete | LEDs off, servo parks |

### Hardware connection lifecycle

- `_find_arduino_port()` tries `ARDUINO_PORT` from `.env` first, then scans COM ports for
  "arduino"/"ch340"/"cp210"/"usb serial" in the description, then falls back to any remaining port.
- **Debug-mode double-import guard**: Flask's reloader imports `app.py` twice (a watcher process
  that never exits, plus the actual server). Hardware connection, OmniVoice auto-launch, and the
  boot-greeting pre-warm thread are all gated on `_should_connect_hardware` (true only when
  `WERKZEUG_RUN_MAIN=="true"` or debug is off) so the watcher process doesn't steal the serial port.
- If no Arduino is found, the app runs in software-only mode (UI updates still work via SocketIO;
  serial writes are just skipped).
- A failed `arduino.write()` triggers `_reconnect_arduino()`, since write failures usually mean the
  board brownout-reset and Windows re-enumerated it on a different COM port.

### GPU tiering

`detect_gpu_vram()` shells out to `nvidia-smi`; `select_gpu_tier()` picks a model + context size
from the `GPU_TIERS` table in `app.py` based on available VRAM (falls back to a small model with
0 VRAM detected, e.g. no NVIDIA GPU present). Override with `OVERRIDE_MODEL` in `.env`.

### OmniVoice (TTS)

- Auto-launched via `_ensure_omnivoice_running()` at startup if its `/audio/voices` endpoint isn't
  already reachable; its own backend takes ~10-60s to finish loading after launch.
- `/tts` responses are cached in a separate `LRUCache` (`tts_cache`) keyed by voice+text hash.
- The boot greeting's audio is pre-warmed in a background thread on startup so the browser's first
  page load doesn't eat the OmniVoice cold-start latency.
- `_synthesize_speech()` retries through `ConnectionError`s (up to 10x, 5s apart) to ride out that
  startup window rather than failing the first request after launch.

## Conventions worth preserving

- Logging: `logging.basicConfig()` with timestamps + function name; `log.warning`/`log.error` use
  emoji prefixes (⚠️/❌), hardware-related lines are tagged `[HARDWARE]`, `[OMNIVOICE]`, `[CREWAI]`.
- `trigger_hardware_state()` always emits the SocketIO update *and* attempts the serial write in
  the same call — don't split those without a reason.
- New external API integrations should go through the existing `rate_limiter` and `cache`
  instances rather than adding new ad hoc throttling/caching.
