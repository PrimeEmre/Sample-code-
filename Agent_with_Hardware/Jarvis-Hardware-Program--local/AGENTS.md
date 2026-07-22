# Jarvis Hardware Program — Agent Guide

**Jarvis Hardware Program** is a Flask-based web application that orchestrates AI research via CrewAI, displays results in a web UI, and controls physical hardware (Arduino) to visualize processing states.

## Project Overview

The system implements a multi-state research workflow:
1. **Idle**: System at rest
2. **Researching**: Querying external sources; blue LED pulses, servo sweeps
3. **Debating**: CrewAI agents discussing findings; yellow LED pulses faster
4. **Complete**: Results ready; LEDs off, servo parks

## Architecture

```
┌─ Flask App (app.py)
│  ├─ Flask-SocketIO: WebSocket server for real-time UI updates
│  ├─ CrewAI Integration: Task delegation & multi-agent research
│  ├─ Ollama Integration: Local LLM for on-device inference
│  ├─ OmniVoice Studio: Text-to-speech engine (auto-launched if missing)
│  └─ Arduino Serial Handler: Hardware state control & monitoring
├─ Web UI (templates/ + static/)
│  └─ index.html, script.js, style.css
├─ Hardware (jarvis_hardware/jarvis_hardware.ino)
│  └─ Arduino sketch; controls LEDs (pins 12, 13) & servo
└─ Configuration (.env)
   └─ API keys, ports, hardware settings
```

## Key Files & Their Roles

| File | Role |
|------|------|
| `app.py` | Main Flask application, hardware orchestration, rate limiting |
| `test_connection.py` | Standalone hardware connectivity verification |
| `jarvis_hardware/jarvis_hardware.ino` | Arduino firmware for LED & servo control |
| `templates/index.html` | Web UI template |
| `static/script.js` | Client-side logic & WebSocket listeners |
| `static/style.css` | Styling |
| `.env` | Configuration (see **Configuration** section below) |

## Hardware State Signals

Arduino recognizes these single-character commands:

| Signal | State | Behavior |
|--------|-------|----------|
| `"0"` | IDLE | All LEDs off, servo at 90° |
| `"B"` | RESEARCHING | Blue LED (pin 12) pulses, servo sweeps |
| `"Y"` | DEBATING | Yellow LED (pin 13) faster pulse, servo sweeps |
| `"W"` | COMPLETE | LEDs off, servo parks |

Sent via `trigger_hardware_state(state_name)` → broadcasts via WebSocket & writes to serial.

## Configuration

All configuration is via environment variables in `.env`:

```bash
# Flask
SECRET_KEY=<random_key>
FLASK_DEBUG=1              # Enable debug mode (auto-reloads, graceful hardware detection)

# Arduino Serial
ARDUINO_PORT=COM3          # (optional) Force a specific port; auto-detects if omitted

# CrewAI
CREWAI_CREW_URL=           # Base URL of CrewAI deployment
CREWAI_CREW_TOKEN=         # Bearer token
CREWAI_INPUT_KEY=query     # Input parameter name your crew's tasks expect

# Ollama (Local LLM)
OLLAMA_URL=http://localhost:11434/api/chat

# OmniVoice Studio (Text-to-Speech)
OMNIVOICE_URL=http://localhost:3900/v1
OMNIVOICE_VOICE=alloy
OMNIVOICE_APP_PATH=C:\Program Files\OmniVoice Studio\omnivoice-studio.exe
```

## Development Conventions

### Logging

All modules use `logging.basicConfig()` with timestamps and function names:
```python
log = logging.getLogger(__name__)
log.info("Message")         # Info level
log.warning("⚠️ Message")   # Warnings with emoji prefix
log.error("❌ Message")     # Errors with emoji prefix
```

### Hardware Communication

1. **Auto-detection**: `_find_arduino_port()` scans COM ports for "arduino", "ch340", "cp210" keywords, then falls back to all ports.
2. **Graceful degradation**: If no Arduino found, app runs in **software-only mode** — UI updates work but no physical signals sent.
3. **Reconnection**: Write failures trigger `_reconnect_arduino()` to handle board drops or port re-enumeration.
4. **Debug mode caveat**: Flask's reloader runs the module twice. Hardware connection only happens in the actual server process (`WERKZEUG_RUN_MAIN=true`).

### WebSocket Events

Flask-SocketIO broadcasts state changes:
```python
socketio.emit('status_update', {'state': state})
```

Client listens on `status_update` and updates UI accordingly.

### Rate Limiting & Caching

- **RateLimiter**: Thread-safe, sliding-window rate limiter (default: 10 req/60s per IP).
- **LRUCache**: Bounded cache with TTL (default: 1hr, max 128 items) to avoid repeated expensive calls.

## Common Tasks

### Testing Hardware Without Full App
```bash
python test_connection.py
```
Cycles through all states, 4 seconds each. Verify LEDs and servo movement.

### Debugging Serial Connection Issues
1. Check `.env` for `ARDUINO_PORT` — if set, only that port is tried.
2. Run `test_connection.py` to confirm port auto-detection works.
3. Look for `[HARDWARE]` log lines to see which ports were scanned.
4. Ensure Arduino sketch is uploaded to the board.

### Adding a New Hardware State
1. Add signal + name to `signals` dict in `trigger_hardware_state(state: str)`.
2. Update Arduino sketch to handle the new signal.
3. Update `test_connection.py` STATES list for testing.
4. Broadcast via WebSocket in the same function (already done).

### Integrating a New External API
1. Add environment variable to `.env`.
2. Load in `app.py` via `os.getenv("KEY", default)`.
3. Use `rate_limiter.is_allowed(client_id)` to throttle requests.
4. Use `cache.get(key)` / `cache.set(key, value)` to avoid redundant calls.
5. Log calls with `log.info()` or `log.debug()` for troubleshooting.

## Testing & Validation

- **Unit tests**: Place in project root as `test_*.py` (e.g., `test_connection.py`).
- **Hardware tests**: Run `test_connection.py` to verify serial connectivity and state signals.
- **Web UI**: Open `http://localhost:5000` in browser after starting `python app.py`.

## Troubleshooting

| Issue | Likely Cause | Fix |
|-------|--------------|-----|
| "No Arduino found" on startup | Serial cable disconnected or board in bootloader | Physically check connection; restart Arduino if needed |
| Hardware stops responding mid-session | Board brownout (servo drawing too much current) | Check power supply; may need separate 5V rail for servo |
| OmniVoice errors in logs | TTS service not running | App auto-launches it; check `OMNIVOICE_APP_PATH` |
| Requests always rate-limited | IP key collision in `RateLimiter` | Check client ID generation logic; clear rate limiter state |
| Stale cache values | TTL too long | Reduce `LRUCache(ttl=...)` or manually call `cache.clear()` |

## Next Steps for Agents

- **Bug fixes**: Search logs for `[ERROR]` or `❌` prefixes; check hardware reconnection logic.
- **New features**: Follow existing patterns for logging, rate limiting, and WebSocket broadcasts.
- **Hardware additions**: Mirror the state machine pattern used for LEDs/servo.
- **Performance**: Profile via `logger.debug()` calls around expensive operations; use caching for external API calls.
