import os
import re
import time
import logging
import subprocess
import threading
import hashlib
import html
import requests
import serial
import serial.tools.list_ports
from collections import OrderedDict
from datetime import date, datetime, timezone
from dotenv import load_dotenv
from ddgs import DDGS
from flask import Flask, render_template, request, jsonify, abort, Response
from flask_socketio import SocketIO, emit  # <-- ADDED

load_dotenv(override=True)

# ── LOGGING ───────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(funcName)s:%(lineno)d %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)

app = Flask(__name__, static_folder="static", template_folder="templates")
app.secret_key = os.getenv("SECRET_KEY") or os.urandom(32)

# ── ADDED: SOCKETIO SETUP ─────────────────────────────────────
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")

# ── CONFIGURATION ──────────────────────────────────────────────
CREWAI_CREW_URL   = os.getenv("CREWAI_CREW_URL", "")
CREWAI_CREW_TOKEN = os.getenv("CREWAI_CREW_TOKEN", "")
CREWAI_KICKOFF_URL = f"{CREWAI_CREW_URL}/kickoff" if CREWAI_CREW_URL else ""
CREWAI_STATUS_URL  = f"{CREWAI_CREW_URL}/status/{{kickoff_id}}" if CREWAI_CREW_URL else ""
# The input variable name your crew's task prompts expect (e.g. a task
# written as "Research {topic}..." needs CREWAI_INPUT_KEY=topic). Defaults
# to "query" -- adjust in .env to match your actual crew, not this code.
CREWAI_INPUT_KEY = os.getenv("CREWAI_INPUT_KEY", "query")
CREWAI_POLL_INTERVAL_SECONDS = 5
CREWAI_POLL_TIMEOUT_SECONDS = 240

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/chat")
DEBUG_MODE = os.getenv("FLASK_DEBUG", "1") == "1"

# OmniVoice Studio -- local, OpenAI-compatible TTS server (no API key needed).
# https://github.com/debpalash/OmniVoice-Studio
OMNIVOICE_URL = os.getenv("OMNIVOICE_URL", "http://localhost:3900/v1")
OMNIVOICE_VOICE = os.getenv("OMNIVOICE_VOICE", "alloy")

# ── ARDUINO SERIAL SETUP ──────────────────────────────────────
def _find_arduino_port() -> str | None:
    """Try the env-specified port first, then scan all COM ports for an Arduino."""
    env_port = os.getenv("ARDUINO_PORT", "")
    candidates = []

    if env_port:
        candidates.append(env_port)

    for p in serial.tools.list_ports.comports():
        desc = (p.description or "").lower()
        if any(kw in desc for kw in ("arduino", "ch340", "cp210", "usb serial")):
            if p.device not in candidates:
                candidates.append(p.device)

    for p in serial.tools.list_ports.comports():
        if p.device not in candidates:
            candidates.append(p.device)

    log.info(f"[HARDWARE] Port candidates to try: {candidates}")
    for port in candidates:
        try:
            conn = serial.Serial(port=port, baudrate=9600, timeout=1)
            time.sleep(2) 
            log.info(f"🔌 [HARDWARE] Connected successfully on {port}.")
            return conn
        except Exception as e:
            log.debug(f"[HARDWARE] {port} failed: {e}")

    return None

# Flask's debug reloader runs this module twice: once as a watcher process
# that never exits, and once as the actual server (marked by WERKZEUG_RUN_MAIN).
# Only open the serial port in the process that's actually serving requests,
# otherwise the watcher holds it open and the real server can never connect.
_should_connect_hardware = not DEBUG_MODE or os.environ.get("WERKZEUG_RUN_MAIN") == "true"

arduino = _find_arduino_port() if _should_connect_hardware else None
if arduino is None and _should_connect_hardware:
    log.warning("⚠️ [HARDWARE] No Arduino found on any port. Software-only mode enabled.")

# ── OMNIVOICE AUTO-LAUNCH ──────────────────────────────────────
OMNIVOICE_APP_PATH = os.getenv(
    "OMNIVOICE_APP_PATH", r"C:\Program Files\OmniVoice Studio\omnivoice-studio.exe"
)

def _ensure_omnivoice_running():
    """Launch OmniVoice Studio in the background if its API isn't already up.
    Its own backend takes ~10-15s to finish loading, so this doesn't wait --
    /tts just returns a clear error until it's ready."""
    try:
        requests.get(f"{OMNIVOICE_URL}/audio/voices", timeout=2)
        log.info("🔊 [OMNIVOICE] Already running.")
        return
    except Exception:
        pass

    if not os.path.exists(OMNIVOICE_APP_PATH):
        log.warning(
            f"⚠️ [OMNIVOICE] Not running and no executable found at {OMNIVOICE_APP_PATH}. "
            "Set OMNIVOICE_APP_PATH in .env if it's installed elsewhere."
        )
        return

    try:
        subprocess.Popen([OMNIVOICE_APP_PATH], close_fds=True)
        log.info("🔊 [OMNIVOICE] Not running -- launching it in the background.")
    except Exception as e:
        log.error(f"❌ [OMNIVOICE] Failed to launch: {e}")

if _should_connect_hardware:
    _ensure_omnivoice_running()

# ── MODIFIED: JARVIS HARDWARE STATES ──────────────────────────
def trigger_hardware_state(state: str):
    """Sends signals to Arduino based on JARVIS UI states and emits to Web UI."""
    signals = {
        "idle": "0",
        "researching": "B", # Blue LED
        "debating": "Y",    # Yellow LED
        "complete": "W"     # White LED / Relay
    }
    
    sig = signals.get(state, "0")
    
    # 1. Push visual update to the Web UI instantly via WebSocket
    socketio.emit('status_update', {'state': state})
    
    # 2. Push physical update to Arduino
    if not arduino or not arduino.is_open:
        return
        
    try:
        arduino.write(sig.encode('utf-8'))
        log.info(f"🔌 [HARDWARE] Sent '{sig}' -> State: {state.upper()}")
    except Exception as e:
        log.error(f"❌ Failed writing to serial interface: {e}")
        _reconnect_arduino()

def _reconnect_arduino():
    """A write failure usually means the board dropped off and Windows
    re-enumerated it on a new COM port (often a brownout from something like
    a servo drawing too much current off the board's own 5V rail during a
    long-running state) -- the old handle is dead for the rest of the
    process otherwise, so re-scan and pick up wherever it lands."""
    global arduino
    try:
        if arduino:
            arduino.close()
    except Exception:
        pass
    arduino = _find_arduino_port()
    if arduino is None:
        log.warning("⚠️ [HARDWARE] Reconnect failed -- no Arduino found. Software-only mode until next successful signal.")

# ── RATE LIMITER ──────────────────────────────────────────────
class RateLimiter:
    def __init__(self, max_requests: int = 10, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window = window_seconds
        self._requests: dict[str, list[float]] = {}
        self._lock = threading.Lock()

    def is_allowed(self, key: str) -> bool:
        now = time.time()
        with self._lock:
            if key not in self._requests:
                self._requests[key] = []
            self._requests[key] = [t for t in self._requests[key] if now - t < self.window]
            if len(self._requests[key]) >= self.max_requests:
                return False
            self._requests[key].append(now)
            return True

rate_limiter = RateLimiter(max_requests=10, window_seconds=60)

# ── BOUNDED LRU CACHE ────────────────────────────────────────
class LRUCache:
    def __init__(self, ttl: int = 3600, max_size: int = 128):
        self.ttl = ttl
        self.max_size = max_size
        self._store: OrderedDict[str, tuple[float, dict]] = OrderedDict()
        self._lock = threading.Lock()

    def get(self, key: str):
        with self._lock:
            if key not in self._store: return None
            ts, data = self._store[key]
            if time.time() - ts > self.ttl:
                del self._store[key]
                return None
            self._store.move_to_end(key)
            return data

    def set(self, key: str, data: dict):
        with self._lock:
            if key in self._store:
                del self._store[key]
            elif len(self._store) >= self.max_size:
                self._store.popitem(last=False) 
            self._store[key] = (time.time(), data)

cache = LRUCache(ttl=int(os.getenv("CACHE_TTL", 3600)), max_size=128)
# OmniVoice's own synthesis takes several seconds regardless of engine choice
# (measured, not our overhead) -- cache generated audio so repeated lines
# (e.g. the boot greeting, replayed on every page load) are instant after
# the first generation.
tts_cache = LRUCache(ttl=int(os.getenv("CACHE_TTL", 3600)), max_size=64)

# ── GPU TIER SYSTEM ──────────────────────────────────────────
GPU_TIERS = [
    {"min_vram": 48, "model": "qwen2.5:72b",      "num_ctx": 32768, "num_batch": 2048, "search_results": 10},
    {"min_vram": 40, "model": "llama3.3:70b",      "num_ctx": 32768, "num_batch": 2048, "search_results": 10},
    {"min_vram": 32, "model": "qwen2.5:32b",       "num_ctx": 24576, "num_batch": 1024, "search_results": 8},
    {"min_vram": 24, "model": "qwen2.5:32b",       "num_ctx": 16384, "num_batch": 1024, "search_results": 8},
    {"min_vram": 16, "model": "qwen2.5:14b",       "num_ctx": 16384, "num_batch": 512,  "search_results": 7},
    {"min_vram": 12, "model": "qwen2.5:14b",       "num_ctx": 4096,  "num_batch": 512,  "search_results": 5},
    {"min_vram": 8,  "model": "llama3.1:8b",       "num_ctx": 8192,  "num_batch": 256,  "search_results": 5},
    {"min_vram": 0,  "model": "qwen2.5-coder:1.5b","num_ctx": 4096,  "num_batch": 128,  "search_results": 4},
]

OVERRIDE_MODEL = os.getenv("OVERRIDE_MODEL", "")

def detect_gpu_vram() -> float:
    try:
        result = subprocess.run(
            ["nvidia-smi", "--query-gpu=memory.total", "--format=csv,noheader,nounits"],
            capture_output=True, text=True, timeout=5,
        )
        if result.returncode == 0 and result.stdout.strip():
            total_mb = sum(int(line.strip()) for line in result.stdout.strip().split("\n") if line.strip().isdigit())
            return round(total_mb / 1024, 1)
    except Exception: pass
    return 0.0

def select_gpu_tier(vram_gb: float) -> dict:
    for tier in GPU_TIERS:
        if vram_gb >= tier["min_vram"]:
            selected = dict(tier)
            if OVERRIDE_MODEL: selected["model"] = OVERRIDE_MODEL
            selected["num_thread"] = 4
            selected["keep_alive"] = os.getenv("OLLAMA_KEEP_ALIVE", "5m")
            selected["temperature"] = 0.7 # Slightly higher for conversational chat
            return selected
    return dict(GPU_TIERS[-1])

GPU_VRAM = detect_gpu_vram()
GPU_CONFIG = select_gpu_tier(GPU_VRAM)

log.info("═" * 50)
log.info(f"   GPU VRAM: {GPU_VRAM}GB")
log.info(f"   Selected Model: {GPU_CONFIG['model']}")
log.info(f"   Context Window: {GPU_CONFIG['num_ctx']} tokens")
log.info("═" * 50)

# ── JARVIS CHAT PROMPT ────────────────────────────────────────
JARVIS_SYSTEM_PROMPT = """You are J.A.R.V.I.S., a highly advanced, professional AI assistant created by Tony Stark. 
You are helpful, concise, and use modern technology terminology. You have access to live internet search results to answer questions accurately.
Do not use markdown headers like # or ##. Just provide well-structured plain text responses."""

BOOT_GREETING = (
    "Good evening, sir. Diagnostics complete, all systems nominal, "
    "and I've taken the liberty of standing by. How may I be of service?"
)

# ── HELPERS ────────────────────────────────────────────────────
def get_crew_headers() -> dict:
    return {"Authorization": f"Bearer {CREWAI_CREW_TOKEN}", "Content-Type": "application/json"}

STOP_WORDS = {"and", "or", "the", "a", "an", "of", "in", "on", "at", "to", "for", "is", "are", "was", "were", "with", "how", "what", "why", "who"}

def topic_keywords(topic: str) -> list[str]:
    words = re.findall(r"[a-zA-Z0-9]+", topic.lower())
    return [w for w in words if w not in STOP_WORDS and len(w) > 2] or [topic.lower()]

def sanitize_topic(topic: str) -> str:
    topic = re.sub(r"<[^>]*>", "", topic)
    topic = html.escape(topic)
    topic = re.sub(r"[\x00-\x1f\x7f]", "", topic)
    return re.sub(r"\s+", " ", topic).strip()

def sanitize_speech_text(text: str) -> str:
    text = re.sub(r"<[^>]*>", "", text)
    text = re.sub(r"[\x00-\x1f\x7f]", "", text)
    return re.sub(r"\s+", " ", text).strip()

def topic_specific_search(topic: str, max_results: int = 5) -> str:
    keywords = topic_keywords(topic)
    if not keywords: return "No specific keywords found."
    query = " ".join(keywords[:5])
    
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=max_results))
        if not results: return f"No search results found for {topic}."
        return "\n---\n".join([f"Title: {r.get('title', '')}\nSummary: {r.get('body', '')}" for r in results])
    except Exception as e:
        log.warning(f"Search failed: {e}")
        return "Search engine unavailable."

def crewai_research(topic: str) -> str:
    """Kick off the configured Crew and poll for its result. Falls back to
    the direct DDGS search if CrewAI isn't configured, or if the run errors
    out or exceeds the poll timeout -- so /chat still works without a crew."""
    if not CREWAI_CREW_URL:
        return topic_specific_search(topic)

    try:
        kickoff = requests.post(
            CREWAI_KICKOFF_URL,
            headers=get_crew_headers(),
            json={"inputs": {CREWAI_INPUT_KEY: topic}},
            timeout=15,
        )
        kickoff.raise_for_status()
        kickoff_data = kickoff.json()
        kickoff_id = kickoff_data.get("kickoff_id") or kickoff_data.get("crew_id")
        if not kickoff_id:
            raise ValueError(f"No kickoff_id in kickoff response: {kickoff_data}")

        deadline = time.time() + CREWAI_POLL_TIMEOUT_SECONDS
        while time.time() < deadline:
            time.sleep(CREWAI_POLL_INTERVAL_SECONDS)
            status_resp = requests.get(
                CREWAI_STATUS_URL.format(kickoff_id=kickoff_id),
                headers=get_crew_headers(),
                timeout=15,
            )
            status_resp.raise_for_status()
            status_data = status_resp.json()
            state = status_data.get("status")

            if state == "completed":
                result = status_data.get("result") or status_data.get("output") or ""
                return str(result) if result else "The research crew completed but returned no result."
            if state == "failed":
                raise RuntimeError(status_data.get("error", "Crew run failed with no error detail."))

        raise TimeoutError(f"Crew run did not complete within {CREWAI_POLL_TIMEOUT_SECONDS}s.")
    except Exception as e:
        log.warning(f"⚠️ [CREWAI] Research run failed, falling back to direct search: {e}")
        return topic_specific_search(topic)

def ollama_chat(messages: list, retries: int = 2) -> str | None:
    """Returns None on failure (rather than an apology string) so callers
    can tell a real failure apart from a real reply -- otherwise the /chat
    cache would store "I'm having trouble reaching my reasoning engine" as
    if it were a valid answer and keep replaying it for up to CACHE_TTL
    even after Ollama comes back up."""
    payload = {
        "model": GPU_CONFIG["model"], "messages": messages, "stream": False,
        "keep_alive": GPU_CONFIG["keep_alive"],
        "options": {"temperature": GPU_CONFIG["temperature"], "num_ctx": GPU_CONFIG["num_ctx"], "num_batch": GPU_CONFIG["num_batch"]}
    }
    for attempt in range(retries + 1):
        try:
            timeout = 120 + (GPU_CONFIG["num_ctx"] // 1024) * 30
            resp = requests.post(OLLAMA_URL, json=payload, timeout=timeout)
            resp.raise_for_status()
            return resp.json().get("message", {}).get("content", "").strip()
        except Exception as e:
            log.warning(f"Ollama failure: {e}")
            time.sleep(3 ** attempt)
    return None

# ── ROUTES ─────────────────────────────────────────────────────
@app.route("/")
def index():
    return render_template("index.html", boot_greeting=BOOT_GREETING)

@app.route("/chat", methods=["POST"])
def chat():
    if not rate_limiter.is_allowed(request.remote_addr or "unknown"):
        return jsonify({"error": "Rate limit exceeded. Please slow down."}), 429

    data = request.get_json(silent=True) or {}
    user_message = sanitize_topic(str(data.get("message", "")).strip())
    if not user_message:
        return jsonify({"error": "Message cannot be empty."}), 400

    cache_key = hashlib.sha256(user_message.lower().encode("utf-8")).hexdigest()
    cached = cache.get(cache_key)
    if cached:
        return jsonify(cached)

    trigger_hardware_state("researching")
    try:
        search_context = topic_specific_search(user_message)
        messages = [
            {"role": "system", "content": JARVIS_SYSTEM_PROMPT},
            {"role": "system", "content": f"Live search results:\n{search_context}"},
            {"role": "user", "content": user_message},
        ]
        trigger_hardware_state("debating")
        reply = ollama_chat(messages)
    finally:
        trigger_hardware_state("complete")

    if reply is None:
        return jsonify({"reply": "I apologize, but I'm having trouble reaching my reasoning engine right now. Please try again shortly."})

    result = {"reply": reply}
    cache.set(cache_key, result)
    return jsonify(result)

def _tts_cache_key(text: str) -> str:
    return hashlib.sha256(f"{OMNIVOICE_VOICE}:{text}".lower().encode("utf-8")).hexdigest()

def _synthesize_speech(text: str) -> bytes:
    """Get audio bytes for text, using the cache if present. Raises on failure.
    OmniVoice takes ~15-60s to finish booting after _ensure_omnivoice_running()
    launches it, so a freshly-started server routinely refuses the first
    request or two -- retry through that startup window before giving up."""
    cache_key = _tts_cache_key(text)
    cached_audio = tts_cache.get(cache_key)
    if cached_audio:
        return cached_audio

    connect_retries = 10
    for attempt in range(connect_retries):
        try:
            resp = requests.post(
                f"{OMNIVOICE_URL}/audio/speech",
                json={"model": "tts-1", "voice": OMNIVOICE_VOICE, "input": text, "response_format": "wav"},
                timeout=60,
            )
            resp.raise_for_status()
            tts_cache.set(cache_key, resp.content)
            return resp.content
        except requests.exceptions.ConnectionError:
            if attempt == connect_retries - 1:
                raise
            log.info(f"🔊 [OMNIVOICE] Not up yet (attempt {attempt + 1}/{connect_retries}), retrying...")
            time.sleep(5)

@app.route("/tts", methods=["POST"])
def tts():
    if not rate_limiter.is_allowed(request.remote_addr or "unknown"):
        return jsonify({"error": "Rate limit exceeded. Please slow down."}), 429

    data = request.get_json(silent=True) or {}
    text = sanitize_speech_text(str(data.get("text", "")).strip())
    if not text:
        return jsonify({"error": "Text cannot be empty."}), 400

    try:
        audio = _synthesize_speech(text)
    except requests.exceptions.ConnectionError as e:
        log.error(f"❌ OmniVoice still unreachable: {e}")
        return jsonify({"error": "OmniVoice Studio is still starting up. Try again in a few seconds."}), 502
    except Exception as e:
        log.error(f"❌ OmniVoice TTS failed: {e}")
        return jsonify({"error": "Voice synthesis is unavailable. Is OmniVoice Studio running?"}), 502

    return Response(audio, mimetype="audio/wav")

def _warm_boot_greeting_cache():
    """Pre-generate the boot greeting's audio in the background so it's
    already cached by the time a browser actually loads the page, instead of
    the user's first page load being the thing that eats the OmniVoice
    startup + generation wait."""
    try:
        log.info("🔊 [OMNIVOICE] Pre-warming boot greeting audio in the background...")
        _synthesize_speech(BOOT_GREETING)
        log.info("🔊 [OMNIVOICE] Boot greeting cached and ready.")
    except Exception as e:
        log.warning(f"⚠️ [OMNIVOICE] Boot greeting pre-warm failed (will retry on first real request): {e}")

if _should_connect_hardware:
    threading.Thread(target=_warm_boot_greeting_cache, daemon=True).start()

# ── ENTRYPOINT ─────────────────────────────────────────────────
if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=DEBUG_MODE)