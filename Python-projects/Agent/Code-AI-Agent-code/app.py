from flask import Flask, render_template, request, jsonify, session, send_file
import requests
import json
import os
import io
import base64
from duckduckgo_search import DDGS
from bs4 import BeautifulSoup
from datetime import date

app = Flask(__name__, static_folder='static')
app.secret_key = "code_agent_secret_123"

# ── Configuration ──────────────────────────────────────────────
GOOGLE_TTS_KEY = "your api"
GOOGLE_TTS_URL = f"https://texttospeech.googleapis.com/v1/text:synthesize?key={GOOGLE_TTS_KEY}"

OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL = "qwen2.5-coder:3b"

MAX_HISTORY        = 20
MAX_SEARCH_RESULTS = 4
MAX_PAGE_CHARS     = 3000
MAX_TTS_CHARS      = 4500

# ── Prompts ────────────────────────────────────────────────────
CHAT_SYSTEM_PROMPT = f"""You are Code-Agent, an expert AI coding assistant and copilot.
Today's date is {date.today()}.
Help users with coding questions, debugging, and best practices.
Be concise, precise, and use code examples when helpful."""

REVIEW_SYSTEM_PROMPT = """You are Code-Agent, an expert code reviewer and debugging copilot.
Your job is to analyze code and provide a clear, structured review.

Format your response EXACTLY like this:

🔴 ERRORS FOUND:
- List each error with line number if possible
- Explain why it is wrong

⚠️ WARNINGS:
- List potential issues, bad practices, or things to improve

✅ WHAT IS CORRECT:
- List what the code does well

💡 FIXED CODE:
- Provide the corrected version of the code

📝 EXPLANATION:
- Briefly explain what the code does overall

Be specific, mention line numbers when possible, and always provide the fixed version."""

ASK_SYSTEM_PROMPT = """You are Code-Agent, an expert coding copilot.
The user will give you their code and ask a specific question about it.
Answer clearly and concisely. Use code snippets in your answer when helpful.
Focus only on answering their specific question."""

RESEARCH_SYSTEM_PROMPT = """You are an expert research assistant specialized in programming and technology.
Given research data from the web, write a comprehensive, well-structured report.
Your report MUST include these sections:
# Executive Summary
# Key Findings
# Important Facts & Code Examples
# Conclusion
# Sources
Use markdown formatting. Be thorough but concise."""

# ── Google TTS Voices ──────────────────────────────────────────
GOOGLE_VOICES = [
    {"id": "en-US-Studio-O",  "name": "Studio O (Female)"},
    {"id": "en-US-Studio-Q",  "name": "Studio Q (Male)"},
    {"id": "en-US-Neural2-A", "name": "Neural2 A (Female)"},
    {"id": "en-US-Neural2-D", "name": "Neural2 D (Male)"},
    {"id": "en-GB-Neural2-A", "name": "British A (Female)"},
    {"id": "en-GB-Neural2-B", "name": "British B (Male)"},
    {"id": "en-AU-Neural2-A", "name": "Australian A (Female)"},
    {"id": "en-AU-Neural2-B", "name": "Australian B (Male)"},
]

# ── Helpers ───────────────────────────────────────────────────
def load_history(user_id):
    path = f"histories/{user_id}.json"
    try:
        return json.load(open(path)) if os.path.exists(path) else []
    except (json.JSONDecodeError, IOError):
        return []

def save_history(user_id, history):
    os.makedirs("histories", exist_ok=True)
    with open(f"histories/{user_id}.json", "w") as f:
        json.dump(history, f)

def ollama_chat(messages, temperature=0.3):
    payload = {
        "model": MODEL,
        "messages": messages,
        "stream": False,
        "options": {"temperature": temperature, "top_p": 0.9}
    }
    resp = requests.post(OLLAMA_URL, json=payload, timeout=180)
    resp.raise_for_status()
    return resp.json().get("message", {}).get("content", "")

def parse_badges(review_text):
    """Extract badge info from review text."""
    badges = []
    text_lower = review_text.lower()

    if "🔴" in review_text or "error" in text_lower:
        # Count errors roughly
        error_count = review_text.count("🔴") or review_text.lower().count("error")
        badges.append({"type": "error", "label": f"⚠ ERRORS DETECTED"})

    if "⚠️" in review_text or "warning" in text_lower:
        badges.append({"type": "warning", "label": "⚡ WARNINGS"})

    if "✅" in review_text:
        badges.append({"type": "ok", "label": "✓ GOOD PARTS"})

    if "💡" in review_text:
        badges.append({"type": "info", "label": "💡 FIX PROVIDED"})

    if not badges:
        badges.append({"type": "ok", "label": "✓ NO MAJOR ISSUES"})

    return badges

# ── Search Tools ──────────────────────────────────────────────
def web_search(query: str) -> str:
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=MAX_SEARCH_RESULTS))
        if not results:
            return "No results found."
        output = []
        for r in results:
            output.append(f"Title: {r['title']}\nURL: {r['href']}\nSummary: {r['body']}\n")
        return "\n---\n".join(output)
    except Exception as e:
        return f"Search error: {e}"

def fetch_page(url: str) -> str:
    try:
        headers = {"User-Agent": "Mozilla/5.0 (compatible; CodeAgentBot/1.0)"}
        resp    = requests.get(url, headers=headers, timeout=8)
        resp.raise_for_status()
        soup    = BeautifulSoup(resp.text, "html.parser")
        for tag in soup(["script", "style", "nav", "footer", "header"]):
            tag.decompose()
        text = soup.get_text(separator=" ", strip=True)
        return text[:MAX_PAGE_CHARS] + ("..." if len(text) > MAX_PAGE_CHARS else "")
    except Exception as e:
        return f"Could not fetch page: {e}"

def run_research_agent(topic: str) -> str:
    search1      = web_search(topic)
    search2      = web_search(topic + " tutorial examples best practices")
    page_content = ""
    try:
        with DDGS() as ddgs:
            hits = list(ddgs.text(topic, max_results=1))
        if hits:
            page_content = fetch_page(hits[0]["href"])
    except Exception as e:
        print(f"[Research] Page fetch failed: {e}")

    context = f"""=== SEARCH RESULTS 1 ===\n{search1}
=== SEARCH RESULTS 2 ===\n{search2}
=== PAGE CONTENT ===\n{page_content}"""

    messages = [
        {"role": "system", "content": RESEARCH_SYSTEM_PROMPT},
        {"role": "user", "content": f"Write a comprehensive research report on: **{topic}**\n\nUse this data:\n\n{context}"}
    ]
    return ollama_chat(messages, temperature=0.4)

# ── TTS ───────────────────────────────────────────────────────
def text_to_speech(text: str, voice_name: str) -> bytes:
    lang_code = "-".join(voice_name.split("-")[:2])
    payload = {
        "input": {"text": text[:MAX_TTS_CHARS]},
        "voice": {"languageCode": lang_code, "name": voice_name},
        "audioConfig": {"audioEncoding": "MP3"}
    }
    response = requests.post(GOOGLE_TTS_URL, json=payload)
    response.raise_for_status()
    return base64.b64decode(response.json()["audioContent"])

# ── Routes ────────────────────────────────────────────────────
@app.route("/")
def home():
    session.setdefault("user_id", os.urandom(8).hex())
    return render_template("index.html")

# ── Code Review ───────────────────────────────────────────────
@app.route("/review", methods=["POST"])
def review():
    data = request.get_json()
    code = data.get("code", "").strip()
    lang = data.get("lang", "python")

    if not code:
        return jsonify({"error": "No code provided"}), 400

    messages = [
        {"role": "system", "content": REVIEW_SYSTEM_PROMPT},
        {"role": "user", "content": f"Review this {lang} code:\n\n```{lang}\n{code}\n```"}
    ]

    try:
        review_text = ollama_chat(messages, temperature=0.2)
        badges      = parse_badges(review_text)
        return jsonify({"review": review_text, "badges": badges})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ── Ask About Code ────────────────────────────────────────────
@app.route("/ask", methods=["POST"])
def ask():
    data     = request.get_json()
    question = data.get("question", "").strip()
    code     = data.get("code", "").strip()
    lang     = data.get("lang", "python")

    if not question:
        return jsonify({"error": "No question provided"}), 400

    content = f"Question: {question}"
    if code:
        content += f"\n\nCode context:\n```{lang}\n{code}\n```"

    messages = [
        {"role": "system", "content": ASK_SYSTEM_PROMPT},
        {"role": "user",   "content": content}
    ]

    try:
        answer = ollama_chat(messages, temperature=0.3)
        return jsonify({"answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ── Chat ──────────────────────────────────────────────────────
@app.route("/chat", methods=["POST"])
def chat():
    data         = request.get_json()
    user_message = data.get("message", "").strip()
    user_id      = session.get("user_id", "default")

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    history = load_history(user_id)
    history.append({"role": "user", "content": user_message})
    history = history[-MAX_HISTORY:]

    try:
        messages   = [{"role": "system", "content": CHAT_SYSTEM_PROMPT}] + history
        ai_message = ollama_chat(messages, temperature=0.7)
        history.append({"role": "assistant", "content": ai_message})
        save_history(user_id, history)
        return jsonify({"response": ai_message})
    except Exception as e:
        return jsonify({"response": f"Error: {str(e)}"}), 500

# ── Research ──────────────────────────────────────────────────
@app.route("/research", methods=["POST"])
def research():
    data  = request.get_json()
    topic = data.get("topic", "").strip()
    if not topic:
        return jsonify({"error": "No topic provided"}), 400
    try:
        report   = run_research_agent(topic)
        os.makedirs("reports", exist_ok=True)
        safe     = "".join(c if c.isalnum() or c in " -_" else "" for c in topic)
        filename = f"reports/{safe[:40].replace(' ', '_')}_{date.today()}.md"
        with open(filename, "w", encoding="utf-8") as f:
            f.write(f"# {topic}\n\n{report}")
        return jsonify({"topic": topic, "report": report, "saved_to": filename})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ── TTS ───────────────────────────────────────────────────────
@app.route("/speak", methods=["POST"])
def speak():
    data       = request.get_json()
    text       = data.get("text", "").strip()
    voice_name = data.get("voice_id", "en-US-Studio-O")
    if not text:
        return jsonify({"error": "No text provided"}), 400
    try:
        audio_data = text_to_speech(text, voice_name)
        return send_file(io.BytesIO(audio_data), mimetype="audio/mpeg", download_name="speech.mp3", as_attachment=False)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/voices", methods=["GET"])
def get_voices():
    return jsonify({"voices": GOOGLE_VOICES})

if __name__ == "__main__":
    app.run(debug=True)
