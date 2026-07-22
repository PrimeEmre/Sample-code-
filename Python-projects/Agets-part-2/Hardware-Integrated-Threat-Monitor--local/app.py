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
from flask import Flask, render_template, request, jsonify, abort

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

# ── CONFIGURATION ──────────────────────────────────────────────
CREWAI_CREW_URL   = os.getenv("CREWAI_CREW_URL", "")
CREWAI_CREW_TOKEN = os.getenv("CREWAI_CREW_TOKEN", "")
CREWAI_KICKOFF_URL = f"{CREWAI_CREW_URL}/kickoff" if CREWAI_CREW_URL else ""
CREWAI_STATUS_URL  = f"{CREWAI_CREW_URL}/status/{{kickoff_id}}" if CREWAI_CREW_URL else ""

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/chat")

# ── ARDUINO SERIAL SETUP ──────────────────────────────────────
def _find_arduino_port() -> str | None:
    """Try the env-specified port first, then scan all COM ports for an Arduino."""
    env_port = os.getenv("ARDUINO_PORT", "")
    candidates = []

    if env_port:
        candidates.append(env_port)

    # Append any port whose description mentions Arduino/CH340/CP210x
    for p in serial.tools.list_ports.comports():
        desc = (p.description or "").lower()
        if any(kw in desc for kw in ("arduino", "ch340", "cp210", "usb serial")):
            if p.device not in candidates:
                candidates.append(p.device)

    # Fall back to scanning every COM port
    for p in serial.tools.list_ports.comports():
        if p.device not in candidates:
            candidates.append(p.device)

    log.info(f"[HARDWARE] Port candidates to try: {candidates}")
    for port in candidates:
        try:
            conn = serial.Serial(port=port, baudrate=9600, timeout=1)
            time.sleep(2)  # Allow board to safely reset after handshake
            log.info(f"🔌 [HARDWARE] Connected successfully on {port}.")
            return conn
        except Exception as e:
            log.debug(f"[HARDWARE] {port} failed: {e}")

    return None

arduino = _find_arduino_port()
if arduino is None:
    log.warning("⚠️ [HARDWARE] No Arduino found on any port. Software-only mode enabled.")

def send_hardware_signal(newsletter_text: str) -> str:
    """Reads the AI's triage tag, triggers hardware, and removes the tag from the text."""
    if not arduino or not arduino.is_open:
        # Remove the tag for the UI even if no hardware is attached
        clean_text = re.sub(r"\[.*?HARDWARE_STATUS.*?:.*?CRITICAL.*?\]", "", newsletter_text, flags=re.IGNORECASE).strip()
        clean_text = re.sub(r"\[.*?HARDWARE_STATUS.*?:.*?NOMINAL.*?\]", "", clean_text, flags=re.IGNORECASE).strip()
        return clean_text
    
    try:
        # Use Regex to find "CRITICAL" anywhere near "HARDWARE_STATUS"
        if re.search(r"\[.*?HARDWARE_STATUS.*?:.*?CRITICAL.*?\]", newsletter_text, re.IGNORECASE):
            log.info("🚨 [HARDWARE SIGNAL] Sending 'C' -> Tripping Red Alert LED!")
            arduino.write(b'C')
            clean_text = re.sub(r"\[.*?HARDWARE_STATUS.*?:.*?CRITICAL.*?\]", "", newsletter_text, flags=re.IGNORECASE).strip()
            return clean_text
            
        elif re.search(r"\[.*?HARDWARE_STATUS.*?:.*?NOMINAL.*?\]", newsletter_text, re.IGNORECASE):
            log.info("🟢 [HARDWARE SIGNAL] Sending 'O' -> System Status Nominal (Green LED).")
            arduino.write(b'O')
            clean_text = re.sub(r"\[.*?HARDWARE_STATUS.*?:.*?NOMINAL.*?\]", "", newsletter_text, flags=re.IGNORECASE).strip()
            return clean_text
            
        else:
            # Fallback if the AI forgets to include the tag
            log.info("🟢 [HARDWARE SIGNAL] No tag found. Defaulting to Nominal 'O'.")
            arduino.write(b'O')
            return newsletter_text
            
    except Exception as e:
        log.error(f"❌ Failed writing to serial interface: {e}")
        return newsletter_text

# ── RATE LIMITER ──────────────────────────────────────────────
class RateLimiter:
    """Prevents users from spamming your API and crashing your GPU."""
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
    """Memory-safe cache. Never grows beyond max_size."""
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
                self._store.popitem(last=False) # Evict oldest
            self._store[key] = (time.time(), data)

cache = LRUCache(ttl=int(os.getenv("CACHE_TTL", 3600)), max_size=128)

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
            selected["temperature"] = 0.3
            return selected
    return dict(GPU_TIERS[-1])

GPU_VRAM = detect_gpu_vram()
GPU_CONFIG = select_gpu_tier(GPU_VRAM)

log.info("═" * 50)
log.info(f"   GPU VRAM: {GPU_VRAM}GB")
log.info(f"   Selected Model: {GPU_CONFIG['model']}")
log.info(f"   Context Window: {GPU_CONFIG['num_ctx']} tokens")
log.info("═" * 50)

# ── ADAPTIVE SYSTEM PROMPT ─────────────────────────────────────
def build_threat_prompt(topic: str) -> str:
    if GPU_CONFIG["num_ctx"] >= 16384:
        detail = "Provide DETAILED analysis. Include CVE IDs, specific IOCs (IPs/Hashes), and a Aggregate Risk Table."
        count = 5
    elif GPU_CONFIG["num_ctx"] >= 8192:
        detail = "Provide thorough technical analysis. Include CVE IDs and actionable remediation."
        count = 3
    else:
        detail = "Provide concise but actionable summaries."
        count = 3

    return f"""You are the Lead Cybersecurity Editor for an elite threat intelligence firm.
Review the provided news data and summarize the top {count} most critical vulnerabilities, breaches, or AI developments.

{detail}

CRITICAL FILTER:
The user's requested topic is '{topic}'.
You MUST discard any findings that do not explicitly relate to '{topic}'.

HARDWARE TRIAGE REQUIREMENT:
At the very bottom of your output, you MUST append a hardware status tracking token on a new line.
If any finding contains a severe zero-day threat or critical vulnerability, output exactly: [HARDWARE_STATUS: CRITICAL]
Otherwise, output exactly: [HARDWARE_STATUS: NOMINAL]

RULES:
1. Output ONLY the raw Markdown. No conversational filler.
2. The final line of your document MUST be the [HARDWARE_STATUS: ...] tag.

Use EXACTLY this Markdown template:

# 🛡️ Daily Threat Briefing - {topic} - [Date]

> **Executive Summary:** [2-3 sentences summarizing the overall threat landscape]
> **Threat Level:** [ELEVATED / HIGH / CRITICAL]
---

## 🚨 1. [Name of Threat / Vulnerability]
* **Category:** [Zero-Day / Ransomware / Data Breach / AI Threat]
* **Impact Level:** 🔴 Critical / 🟠 High / 🟡 Medium
* **Affected Systems:** [Specific products/versions]
* **CVE:** [CVE-YYYY-XXXXX or "Pending"]

**Details:**
[Technical description]

**Business Impact & Recommended Actions:**
[Remediation steps]

---
"""

# ── HELPERS ────────────────────────────────────────────────────
def get_crew_headers() -> dict:
    return {"Authorization": f"Bearer {CREWAI_CREW_TOKEN}", "Content-Type": "application/json"}

STOP_WORDS = {"and", "or", "the", "a", "an", "of", "in", "on", "at", "to", "for", "is", "are", "was", "were", "with", "threats", "developments"}

def topic_keywords(topic: str) -> list[str]:
    words = re.findall(r"[a-zA-Z0-9]+", topic.lower())
    return [w for w in words if w not in STOP_WORDS and len(w) > 2] or [topic.lower()]

def is_result_on_topic(result: str, topic: str, threshold: float = 0.25) -> bool:
    if not result: return False
    keywords = topic_keywords(topic)
    lines = [l.strip() for l in result.splitlines() if l.strip()]
    if not lines: return False
    hits = sum(1 for l in lines if any(kw in l.lower() for kw in keywords))
    ratio = hits / len(lines)
    return ratio >= threshold

def sanitize_topic(topic: str) -> str:
    topic = re.sub(r"<[^>]*>", "", topic)
    topic = html.escape(topic)
    topic = re.sub(r"[\x00-\x1f\x7f]", "", topic)
    return re.sub(r"\s+", " ", topic).strip()

def build_topic_search_queries(topic: str) -> list[str]:
    today = date.today().isoformat()
    keywords = topic_keywords(topic)
    if len(keywords) >= 3:
        kw = " ".join(keywords[:3])
        return [
            f"{kw} CVE vulnerability security patch 2026",
            f"{kw} cyberattack breach exploit {today[:7]}",
        ]
    return [
        f'"{topic}" CVE vulnerability security patch 2026',
        f'"{topic}" data breach cyberattack exploit {today[:7]}',
    ]

def topic_specific_search(topic: str, max_results: int = 5) -> str:
    queries = build_topic_search_queries(topic)
    keywords = topic_keywords(topic)
    seen_titles: set[str] = set()
    relevant: list[str] = []

    for query in queries:
        if len(relevant) >= max_results: break
        try:
            with DDGS() as ddgs:
                results = list(ddgs.text(query, max_results=max_results))
            for r in results:
                title = r.get("title", "")
                body = r.get("body", "")
                if title in seen_titles: continue
                seen_titles.add(title)
                combined = (title + " " + body).lower()
                if any(kw in combined for kw in keywords):
                    relevant.append(f"Title: {title}\nSummary: {body}")
        except Exception as e:
            log.warning(f"Search failed for query '{query}': {e}")

    if not relevant: return f"No cybersecurity news found specifically about '{topic}' today."
    return "\n---\n".join(relevant)

def ollama_chat(messages: list, retries: int = 2) -> str:
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
    return "Ollama Error: Local AI server failed."

# ── CREWAI POLLING ────────────────────────────────────────────
def kickoff_crew(topic: str) -> str:
    payload = {"inputs": {"topic": topic, "date": str(date.today())}}
    resp = requests.post(CREWAI_KICKOFF_URL, headers=get_crew_headers(), json=payload, timeout=60)
    resp.raise_for_status()
    return resp.json().get("kickoff_id") or resp.json().get("id")

def poll_crew_result(kickoff_id: str, max_wait: int = 300):
    url = CREWAI_STATUS_URL.format(kickoff_id=kickoff_id)
    deadline = time.time() + max_wait
    while time.time() < deadline:
        try:
            resp = requests.get(url, headers=get_crew_headers(), timeout=15)
            resp.raise_for_status()
            data = resp.json()
            status = (data.get("status") or data.get("state") or "").lower()
            if status in ("completed", "success", "finished"): return data.get("result") or data.get("output"), "completed"
            if status in ("failed", "error"): return None, "failed"
        except Exception: pass
        time.sleep(4)
    return None, "timeout"

# ── MIDDLEWARE ────────────────────────────────────────────────
@app.before_request
def before_request_checks():
    if request.path.startswith("/api/") or request.path == "/generate-briefing":
        client_ip = request.headers.get("X-Forwarded-For", request.remote_addr)
        if not rate_limiter.is_allowed(client_ip):
            abort(429, description="Rate limit exceeded. Please wait.")

# ── ROUTES ─────────────────────────────────────────────────────
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "gpu_vram_gb": GPU_VRAM, "model": GPU_CONFIG["model"]})

@app.route("/api/gpu-info", methods=["GET"])
def gpu_info():
    return jsonify({"vram_gb": GPU_VRAM, "tier_model": GPU_CONFIG["model"], "context_window": GPU_CONFIG["num_ctx"]})

@app.route("/api/clear-cache", methods=["POST"])
def clear_cache():
    with cache._lock:
        cache._store.clear()
    log.info("[CACHE] Manually cleared by user request.")
    return jsonify({"status": "cache cleared"})

@app.route("/api/test-hardware", methods=["GET"])
def test_hardware():
    """Bypasses AI to instantly test the red LED."""
    if arduino and arduino.is_open:
        log.info("🚨 [TEST] Sending 'C' to test Red LED!")
        arduino.write(b'C')
        return jsonify({"status": "success", "message": "Signal 'C' sent! Red LED should be on."})
    
    log.error("❌ [TEST] Arduino is not connected.")
    return jsonify({"status": "error", "message": "Arduino not connected."}), 400

@app.route("/generate-briefing", methods=["POST"])
def generate_briefing():
    try:
        req_data = request.get_json(silent=True) or {}
        raw_topic = req_data.get("topic", "").strip()

        if not raw_topic: return jsonify({"error": "Topic cannot be empty."}), 400
        if len(raw_topic) > 75: return jsonify({"error": "Topic is too long. Max 75 characters."}), 400

        topic = sanitize_topic(raw_topic)
        cache_key = hashlib.sha256(f"{topic}:{date.today().isoformat()}".encode()).hexdigest()

        # 1. Check Cache
        cached_result = cache.get(cache_key)
        if cached_result:
            log.info(f"[CACHE HIT] Returning saved briefing for: {topic}")
            # Re-trigger hardware signaling based on cached string value
            cached_result["newsletter"] = send_hardware_signal(cached_result["newsletter"])
            return jsonify({**cached_result, "cached": True})

        log.info(f"[START] Generating briefing for: {topic}")
        newsletter = None
        source_engine = "Local Ollama"

        # 2. Attempt CrewAI
        if CREWAI_CREW_URL and CREWAI_CREW_TOKEN:
            try:
                kickoff_id = kickoff_crew(topic)
                crew_result, status = poll_crew_result(kickoff_id)
                if crew_result and status == "completed":
                    if is_result_on_topic(crew_result, topic):
                        newsletter = crew_result
                        source_engine = "CrewAI"
            except Exception as e:
                log.warning(f"[CREWAI] Failed, falling back to local: {e}")

        # 3. Local Fallback (Ollama + DuckDuckGo)
        if not newsletter:
            news_data = topic_specific_search(topic, max_results=GPU_CONFIG["search_results"])
            system_prompt = build_threat_prompt(topic)
            newsletter = ollama_chat([
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Here is the raw news data:\n{news_data}\n\nFormat this into today's briefing."}
            ])

        # ── 4. PROCESS HARDWARE SWITCHING LOGIC ──
        # Pass the text to the function, it triggers the Arduino and returns cleaned text
        newsletter = send_hardware_signal(newsletter)

        # SUCCESS: Return generated bundle
        final_response = {"source": source_engine, "newsletter": newsletter, "model": GPU_CONFIG["model"]}
        cache.set(cache_key, final_response)
        return jsonify({**final_response, "cached": False})

    except Exception as e:
        log.exception("CRITICAL ERROR in /generate-briefing: %s", e)
        return jsonify({"error": "The intelligence engine encountered a critical failure. Please try again."}), 500

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "0") == "1"
    app.run(debug=debug, threaded=True, host="0.0.0.0", port=port)