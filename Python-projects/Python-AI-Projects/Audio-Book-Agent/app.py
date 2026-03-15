from flask import Flask, render_template, request, jsonify, session, send_file
import requests
import json
import os
import io
import base64
from duckduckgo_search import DDGS
from bs4 import BeautifulSoup
from datetime import date
import PyPDF2

app = Flask(__name__, static_folder='static')
app.secret_key = "emre_ai_secret_123"

# ── Configuration ──────────────────────────────────────────────
GOOGLE_TTS_KEY = "yout api key "  # ← paste privately in PyCharm
GOOGLE_TTS_URL = f"https://texttospeech.googleapis.com/v1/text:synthesize?key={GOOGLE_TTS_KEY}"

OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL      = "deepseek-r1:7b"

MAX_HISTORY        = 20
MAX_SEARCH_RESULTS = 4
MAX_PAGE_CHARS     = 3000
MAX_TTS_CHARS      = 4500

# ── Prompts ────────────────────────────────────────────────────


RESEARCH_SYSTEM_PROMPT = """You are an expert research assistant.
Given research data from the web, write a comprehensive, well-structured report.
Your report MUST include these sections:
# Executive Summary
# Key Findings
# Important Facts & Statistics
# Conclusion
# Sources
Use markdown formatting. Be thorough but concise."""

AUDIOBOOK_CLEAN_PROMPT = """You are an audiobook editor. 
Clean up this raw text extracted from a PDF so it sounds natural when read aloud.
Rules:
- Remove page numbers, headers, footers
- Fix broken words split across lines
- Remove excessive whitespace
- Keep all the actual content and story
- Do NOT summarize — keep everything
- Return ONLY the cleaned text, nothing else"""

# ── Google TTS Voices ──────────────────────────────────────────
GOOGLE_VOICES = [
    {"id": "en-US-Studio-O",  "name": "Studio O (Female)"},
    {"id": "en-US-Studio-Q",  "name": "Studio Q (Male)"},
    {"id": "en-US-Neural2-A", "name": "Neural2 A (Female)"},
    {"id": "en-US-Neural2-D", "name": "Neural2 D (Male)"},
    {"id": "en-US-Neural2-F", "name": "Neural2 F (Female)"},
    {"id": "en-US-Neural2-J", "name": "Neural2 J (Male)"},
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

# ── Extract text from uploaded file ───────────────────────────
def extract_text(file) -> str:
    filename = file.filename.lower()

    if filename.endswith(".txt"):
        return file.read().decode("utf-8", errors="ignore")

    if filename.endswith(".pdf"):
        reader = PyPDF2.PdfReader(file)
        all_text = []
        for page in reader.pages:
            text = page.extract_text()
            if text:
                all_text.append(text)
        return "\n".join(all_text)

    return ""

# ── Clean text with Ollama ─────────────────────────────────────
def clean_text_with_ai(raw_text: str) -> str:
    sample = raw_text[:6000]

    messages = [
        {"role": "system", "content": AUDIOBOOK_CLEAN_PROMPT},
        {"role": "user",   "content": sample}
    ]

    payload = {
        "model": MODEL,
        "messages": messages,
        "stream": False,
        "options": {"temperature": 0.3}
    }

    try:
        resp    = requests.post(OLLAMA_URL, json=payload, timeout=120)
        cleaned = resp.json().get("message", {}).get("content", "")
        return cleaned if cleaned else raw_text
    except Exception as e:
        print(f"[Ollama clean error] {e}")
        return raw_text

# ── Convert text to MP3 using Google TTS ──────────────────────
def text_to_speech(text: str, voice_name: str) -> bytes:
    lang_code = "-".join(voice_name.split("-")[:2])
    text      = text[:MAX_TTS_CHARS]

    payload = {
        "input": {"text": text},
        "voice": {
            "languageCode": lang_code,
            "name": voice_name
        },
        "audioConfig": {"audioEncoding": "MP3"}
    }

    response = requests.post(GOOGLE_TTS_URL, json=payload)
    response.raise_for_status()
    audio_data = base64.b64decode(response.json()["audioContent"])
    return audio_data

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
        headers = {"User-Agent": "Mozilla/5.0 (compatible; ResearchBot/1.0)"}
        resp    = requests.get(url, headers=headers, timeout=8)
        soup    = BeautifulSoup(resp.text, "html.parser")
        for tag in soup(["script", "style", "nav", "footer", "header"]):
            tag.decompose()
        text = soup.get_text(separator=" ", strip=True)
        return text[:MAX_PAGE_CHARS] + ("..." if len(text) > MAX_PAGE_CHARS else "")
    except Exception as e:
        return f"Could not fetch page: {e}"

# ── Research Agent ────────────────────────────────────────────
def run_research_agent(topic: str) -> str:
    print(f"[Research] Searching: {topic}")

    search1      = web_search(topic)
    search2      = web_search(topic + " latest news facts")
    page_content = ""

    try:
        with DDGS() as ddgs:
            hits = list(ddgs.text(topic, max_results=1))
        if hits:
            page_content = fetch_page(hits[0]["href"])
    except Exception as e:
        print(f"[Research] Page fetch failed: {e}")

    context = f"""=== SEARCH RESULTS 1 ===
{search1}
=== SEARCH RESULTS 2 ===
{search2}
=== PAGE CONTENT ===
{page_content}
"""

    messages = [
        {"role": "system", "content": RESEARCH_SYSTEM_PROMPT},
        {
            "role": "user",
            "content": (
                f"Write a comprehensive research report on: **{topic}**\n\n"
                f"Use this web research data as your source:\n\n{context}"
            )
        }
    ]

    payload = {
        "model": MODEL,
        "messages": messages,
        "stream": False,
        "options": {"temperature": 0.4, "top_p": 0.9}
    }

    resp = requests.post(OLLAMA_URL, json=payload, timeout=180)
    resp.raise_for_status()
    return resp.json().get("message", {}).get("content", "No report generated.")

# ── Routes ────────────────────────────────────────────────────
@app.route("/")
def home():
    session.setdefault("user_id", os.urandom(8).hex())
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message", "")
    user_id      = session.get("user_id", "default")
    history      = load_history(user_id)

    history.append({"role": "user", "content": user_message})
    history = history[-MAX_HISTORY:]

    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": AUDIOBOOK_CLEAN_PROMPT.format(date=date.today())}
        ] + history,
        "stream": False,
        "options": {"temperature": 0.7, "top_p": 0.9, "repeat_penalty": 1.1}
    }

    try:
        response   = requests.post(OLLAMA_URL, json=payload, timeout=120)
        result     = response.json()
        ai_message = result["message"]["content"]
        history.append({"role": "assistant", "content": ai_message})
        save_history(user_id, history)
        return jsonify({"response": ai_message})
    except Exception as e:
        return jsonify({"response": f"Error: {str(e)}"}), 500

@app.route("/research", methods=["POST"])
def research():
    topic = request.json.get("topic", "").strip()
    if not topic:
        return jsonify({"error": "No topic provided"}), 400
    try:
        report   = run_research_agent(topic)
        os.makedirs("reports", exist_ok=True)
        safe     = "".join(c if c.isalnum() or c in " -_" else "" for c in topic)
        filename = f"reports/{safe[:40].replace(' ','_')}_{date.today()}.md"
        with open(filename, "w", encoding="utf-8") as f:
            f.write(f"# {topic}\n\n{report}")
        return jsonify({"topic": topic, "report": report, "saved_to": filename})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/research/list", methods=["GET"])
def list_reports():
    files = []
    if os.path.exists("reports"):
        files = sorted(os.listdir("reports"), reverse=True)
    return jsonify({"reports": files})

@app.route("/speak", methods=["POST"])
def speak():
    text       = request.json.get("text", "")
    voice_name = request.json.get("voice_id", "en-US-Studio-O")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    lang_code = "-".join(voice_name.split("-")[:2])
    payload   = {
        "input": {"text": text},
        "voice": {"languageCode": lang_code, "name": voice_name},
        "audioConfig": {"audioEncoding": "MP3"}
    }

    try:
        response   = requests.post(GOOGLE_TTS_URL, json=payload)
        response.raise_for_status()
        audio_data = base64.b64decode(response.json()["audioContent"])
        return send_file(io.BytesIO(audio_data), mimetype="audio/mpeg")
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/voices", methods=["GET"])
def get_voices():
    return jsonify({"voices": GOOGLE_VOICES})

# ── Audiobook Generator ───────────────────────────────────────
@app.route("/generate_audiobook", methods=["POST"])
def generate_audiobook():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file       = request.files["file"]
    voice_name = request.form.get("voice", "en-US-Studio-O")
    title      = request.form.get("title", "My Audiobook")
    author     = request.form.get("author", "Unknown")

    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    try:
        print(f"[Audiobook] Extracting text from: {file.filename}")
        raw_text = extract_text(file)

        if not raw_text.strip():
            return jsonify({"error": "Could not extract any text from the file"}), 400

        print(f"[Audiobook] Extracted {len(raw_text)} characters")

        print("[Audiobook] Cleaning text with Ollama...")
        cleaned_text = clean_text_with_ai(raw_text)

        print(f"[Audiobook] Cleaned text: {len(cleaned_text)} characters")

        print(f"[Audiobook] Converting to speech with voice: {voice_name}")
        audio_bytes = text_to_speech(cleaned_text, voice_name)

        print(f"[Audiobook] Done! Audio size: {len(audio_bytes)} bytes")

        return send_file(
            io.BytesIO(audio_bytes),
            mimetype="audio/mpeg",
            as_attachment=False,
            download_name=f"{title}.mp3"
        )

    except Exception as e:
        print(f"[Audiobook ERROR] {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)