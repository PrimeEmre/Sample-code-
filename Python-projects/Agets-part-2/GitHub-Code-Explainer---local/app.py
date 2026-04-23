from flask import Flask, render_template, request, jsonify, session, send_file
from flask import send_from_directory
import requests
import os
import io
import base64
import time
from datetime import date
from dotenv import load_dotenv
from duckduckgo_search import DDGS

load_dotenv(override=True)

app = Flask(__name__, static_folder='static', template_folder='templates')
app.secret_key = "hybrid_agent_secret_999"

# ── CONFIGURATION ──────────────────────────────────────────────

# Replace those 3 lines with this:
CREWAI_CREW_URL    = "Your Crew AI URL"
CREWAI_CREW_TOKEN  = "YOUR TOKEN"
CREWAI_KICKOFF_URL = f"{CREWAI_CREW_URL}/kickoff"
CREWAI_STATUS_URL = f"{CREWAI_CREW_URL}/status/{{kickoff_id}}"


OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL      = "qwen2.5-coder:14b"

MAX_SEARCH_RESULTS = 2
MAX_TTS_CHARS      = 4500

# ── HEADERS ────────────────────────────────────────────────────
def get_crew_headers():
    return {
        "Authorization": f"Bearer {CREWAI_CREW_TOKEN}",
        "Content-Type": "application/json"
    }
# ── DATA DICTIONARIES ──────────────────────────────────────────
TONE_DESCRIPTIONS = {
    "professional": "formal, authoritative, and data-driven",
    "casual":       "friendly, conversational, and approachable",
    "persuasive":   "compelling, action-oriented, and convincing",
    "storytelling": "narrative-driven, emotional, and engaging",
}
LENGTH_WORDS = {
    "short":  "600-900 words",
    "medium": "1200-1800 words",
    "long":   "2500-3500 words",
}
# ── HELPERS ────────────────────────────────────────────────────
def fmt_large(n):
    if not isinstance(n, (int, float)): return "N/A"
    if n >= 1e12: return f"${n/1e12:.2f}T"
    if n >= 1e9:  return f"${n/1e9:.2f}B"
    return f"${n/1e6:.2f}M" if n >= 1e6 else f"${n:,.0f}"

def ollama_chat(messages, temperature=0.3):
    payload = {
        "model": MODEL, "messages": messages, "stream": False,
        "options": {"temperature": temperature, "top_p": 0.9, "num_ctx": 2048}
    }
    resp = requests.post(OLLAMA_URL, json=payload, timeout=300)
    resp.raise_for_status()
    return resp.json().get("message", {}).get("content", "").strip()

def web_search(query: str) -> str:
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=MAX_SEARCH_RESULTS))
        return "\n---\n".join([f"Title: {r['title']}\nSummary: {r['body']}" for r in results]) if results else "No results."
    except Exception as e:
        return f"Search error: {e}"

def kickoff_crew(topic: str, tone: str, length: str) -> str:
    # We change the names of the inputs to match your new CrewAI tasks
    payload = {
        "inputs": {
            "commit_message": topic, # The UI "topic" box will now act as your commit message
            "code_changes": "Initial code push: checking repository structure.", # Placeholder for now
            "today": str(date.today()),
        }
    }
    print(f"DEBUG: Calling URL: {CREWAI_KICKOFF_URL}")
    resp = requests.post(CREWAI_KICKOFF_URL, headers=get_crew_headers(), json=payload, timeout=30)
    
    print(f"DEBUG: Status: {resp.status_code}")
    print(f"DEBUG: Body: {resp.text}")
    
    resp.raise_for_status()
    data = resp.json()
    kid = data.get("kickoff_id") or data.get("id")
    return kid

def poll_crew_result(kickoff_id: str):
    url = CREWAI_STATUS_URL.format(kickoff_id=kickoff_id)
    for _ in range(75):
        resp = requests.get(url, headers=get_crew_headers(), timeout=15)
        resp.raise_for_status()
        data = resp.json()
        print(f"DEBUG poll full response: {data}")  # ← add this
        status = (
            data.get("status") or
            data.get("state") or
            data.get("execution_status") or
            ""
        ).lower()
        print(f"DEBUG poll status: {status}")
        if status in ("completed", "success", "finished"):
            return (
                data.get("result") or
                data.get("output") or
                data.get("final_output") or
                data.get("crew_output") or
                str(data)
            )
        if status in ("failed", "error"):
            return None
        time.sleep(4)
    return None

# ── STOCK ──────────────────────────────────────────────────────
def get_fear_greed() -> str:
    try:
        resp = requests.get("https://production.dataviz.cnn.io/index/fearandgreed/graphdata",
                            timeout=5, headers={"User-Agent": "Mozilla/5.0"})
        d = resp.json()["fear_and_greed"]
        return f"Fear & Greed: {d['score']:.0f}/100 — {d['rating'].upper()}"
    except:
        return "Fear & Greed: unavailable"

# ── ICONS ─────────────────────────────────────────────────────
@app.route('/icons/<path:filename>')
def icons(filename):
    return send_from_directory('icons', filename)

@app.route('/favicon.ico')
def favicon():
    return send_from_directory('icons', 'favicon.ico')

# ── ROUTES ─────────────────────────────────────────────────────
@app.route("/")
def home():
    session.setdefault("user_id", os.urandom(8).hex())
    return render_template("index.html")

@app.route("/generate", methods=["POST"])
def generate():
    data   = request.get_json()
    topic  = data.get("topic", "").strip()
    tone   = data.get("tone", "professional")
    length = data.get("length", "medium")
    if not topic:
        return jsonify({"error": "Please provide a topic."}), 400
    try:
        kid    = kickoff_crew(topic, tone, length)
        output = poll_crew_result(kid)
        if not output:
            return jsonify({"error": "Crew failed or timed out."}), 500
        os.makedirs("posts", exist_ok=True)
        safe  = "".join(c if c.isalnum() else "_" for c in topic[:40])
        fname = f"posts/{safe}_{date.today()}.md"
        with open(fname, "w", encoding="utf-8") as f:
            f.write(f"# {topic}\n\n{output}")
        return jsonify({"blog_post": output, "topic": topic, "tone": tone,
                        "length": length, "generated": str(date.today()), "saved_to": fname})
    except requests.HTTPError as e:
        return jsonify({"error": f"CrewAI error: {e.response.text if e.response else str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)