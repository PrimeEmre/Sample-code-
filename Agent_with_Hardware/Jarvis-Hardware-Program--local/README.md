# J.A.R.V.I.S. Hardware Program

A local, self-hosted J.A.R.V.I.S.-style AI assistant: a Flask web app that answers questions
through a local LLM grounded with live web search, speaks its replies with a local text-to-speech
engine, and drives a physical Arduino rig (LEDs + servo) in real time to visualize what it's
doing — researching, debating, or done.

![Status](https://img.shields.io/badge/status-personal--project-blue)
![Python](https://img.shields.io/badge/python-3.10+-blue)
![Platform](https://img.shields.io/badge/platform-Windows-lightgrey)

## Features

- **Conversational chat UI** — clean, single-page interface with a live status "orb" and message log.
- **Local LLM inference** via [Ollama](https://ollama.com/), with automatic model/context selection
  based on detected GPU VRAM (`nvidia-smi`), so the same install scales from a small laptop GPU to
  a high-end card.
- **Live web search grounding** using [DDGS](https://pypi.org/project/ddgs/), so answers reflect
  current information instead of only the model's training data.
- **Optional CrewAI integration** — point it at a deployed [CrewAI](https://www.crewai.com/) crew
  and it will kick off runs and poll for results, falling back to direct search if unset or if a
  run fails/times out.
- **Local text-to-speech** via [OmniVoice Studio](https://github.com/debpalash/OmniVoice-Studio),
  an OpenAI-compatible TTS server that's auto-launched if it isn't already running. No cloud API
  key required.
- **Physical hardware feedback** — an Arduino sketch drives two status LEDs and a sweeping servo
  that mirror the assistant's state (idle / researching / debating / complete) in the real world,
  synced to the UI over WebSockets.
- **Graceful degradation** — runs in software-only mode with no Arduino attached, auto-reconnects
  if the board drops mid-session, and falls back cleanly if CrewAI/OmniVoice are unavailable.
- Built-in **rate limiting** and **response/audio caching** to keep repeated queries cheap and fast.

## How it works

```
Browser (chat UI)
    │  POST /chat
    ▼
Flask app (app.py)
    │
    ├─► DDGS web search  ─┐
    ├─► CrewAI crew (opt.)│──► context ──► Ollama (local LLM) ──► reply
    │                     │
    ├─► Flask-SocketIO ───┴──► pushes live state updates to the browser
    │
    └─► Arduino (serial)  ──► LEDs + servo react to the current state
    │
    ▼
POST /tts  ──► OmniVoice Studio ──► spoken audio streamed back to the browser
```

Every chat request walks through four visible states — **idle → researching → debating →
complete** — each broadcast to the browser via WebSocket and mirrored on the Arduino via a
one-character serial signal, so the physical hardware and the on-screen orb always agree.

| Signal | State | Hardware behavior |
|:-:|---|---|
| `0` | Idle | LEDs off, servo parked at 90° |
| `B` | Researching | Blue LED (pin 12) pulses, servo sweeps |
| `Y` | Debating | Yellow LED (pin 13) pulses faster, servo sweeps |
| `W` | Complete | LEDs off, servo parks |

## Requirements

- Python 3.10+
- An [Ollama](https://ollama.com/) instance running locally (or reachable via `OLLAMA_URL`)
- [OmniVoice Studio](https://github.com/debpalash/OmniVoice-Studio) for text-to-speech (optional
  but recommended — the app will try to auto-launch it)
- An Arduino (Uno/Nano or similar) with 2 LEDs + a servo wired up, flashed with
  [`jarvis_haedware/jarvis_hardware.ino`](jarvis_haedware/jarvis_hardware.ino) (optional — the app
  runs fine without one, just without the physical light show)

## Getting started

1. **Install dependencies**

   ```bash
   pip install flask flask-socketio python-dotenv requests pyserial ddgs
   ```

2. **Configure environment variables**

   Create a `.env` file in the project root:

   ```bash
   # Flask
   SECRET_KEY=<random_key>
   FLASK_DEBUG=1                  # 1 to enable debug/auto-reload, 0 for production

   # Arduino serial (optional — auto-detected if omitted)
   ARDUINO_PORT=COM3

   # CrewAI (optional — falls back to direct web search if unset)
   CREWAI_CREW_URL=
   CREWAI_CREW_TOKEN=
   CREWAI_INPUT_KEY=query

   # Ollama (local LLM)
   OLLAMA_URL=http://localhost:11434/api/chat

   # OmniVoice Studio (local TTS)
   OMNIVOICE_URL=http://localhost:3900/v1
   OMNIVOICE_VOICE=alloy
   OMNIVOICE_APP_PATH=C:\Program Files\OmniVoice Studio\omnivoice-studio.exe
   ```

3. **(Optional) Flash the Arduino**

   Upload [`jarvis_haedware/jarvis_hardware.ino`](jarvis_haedware/jarvis_hardware.ino) to your
   board using the Arduino IDE or CLI. Wiring: blue LED on pin 12, yellow LED on pin 13, servo
   signal on pin 8.

4. **Run the app**

   ```bash
   python app.py
   ```

   Then open **http://localhost:5000** in your browser.

## Verifying hardware separately

To test LED/servo wiring without booting the full Flask app:

```bash
python test_connection.py
```

This connects directly over serial and cycles through every state (4 seconds each) so you can
confirm the board reacts correctly.

## Configuration reference

| Variable | Purpose | Default |
|---|---|---|
| `SECRET_KEY` | Flask session secret | random, generated at startup |
| `FLASK_DEBUG` | Enable Flask debug/reload mode | `1` |
| `ARDUINO_PORT` | Force a specific serial port | auto-detected |
| `CREWAI_CREW_URL` | Base URL of a deployed CrewAI crew | unset (uses direct search) |
| `CREWAI_CREW_TOKEN` | Bearer token for the CrewAI API | unset |
| `CREWAI_INPUT_KEY` | Input key your crew's tasks expect | `query` |
| `OLLAMA_URL` | Ollama chat endpoint | `http://localhost:11434/api/chat` |
| `OMNIVOICE_URL` | OmniVoice Studio API base URL | `http://localhost:3900/v1` |
| `OMNIVOICE_VOICE` | Voice name to use for synthesis | `alloy` |
| `OMNIVOICE_APP_PATH` | Path to the OmniVoice executable, for auto-launch | Windows default install path |
| `CACHE_TTL` | Response/audio cache lifetime, in seconds | `3600` |
| `OVERRIDE_MODEL` | Force a specific Ollama model regardless of detected VRAM | unset |

## Troubleshooting

| Issue | Likely cause | Fix |
|---|---|---|
| "No Arduino found" on startup | Cable disconnected or board in bootloader | Check the physical connection; restart the board |
| Hardware stops responding mid-session | Servo brownout on the board's own 5V rail | Give the servo a separate 5V supply |
| OmniVoice errors in the logs | TTS service not running yet | The app auto-launches it; check `OMNIVOICE_APP_PATH` |
| Requests always rate-limited | Rapid repeated requests from the same client | Rate limit is 10 requests/60s per IP by default |
| Stale-looking replies | Cache TTL too long | Lower `CACHE_TTL` or restart the app |

## Project layout

```
app.py                              Flask app, LLM/search/TTS orchestration, hardware control
test_connection.py                  Standalone Arduino connectivity check
jarvis_haedware/jarvis_hardware.ino Arduino firmware (LED + servo state machine)
templates/index.html                Chat UI
static/script.js                    Client-side chat, TTS playback, WebSocket handling
static/style.css                    Styling
.env                                Local configuration (not committed)
```

See [AGENTS.md](AGENTS.md) for a deeper architectural walkthrough intended for AI coding agents
working in this repo.
