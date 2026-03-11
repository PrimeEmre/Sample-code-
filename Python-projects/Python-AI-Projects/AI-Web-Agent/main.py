from flask import Flask, render_template, request, jsonify, session, send_file
from elevenlabs.client import ElevenLabs
from elevenlabs import VoiceSettings
import requests
import json
import os
from duckduckgo_search import DDGS
from bs4 import BeautifulSoup
import io
from datetime import date

app = Flask(__name__)
app.secret_key = "emre_ai_secret_123"

ELEVENLABS_API_KEY = "your api"

OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL = "gemma3n"  # change to "llama3.2" if you want better tool calling

MAX_HISTORY = 20
MAX_SEARCH_RESULTS = 4
MAX_PAGE_CHARS = 3000

SYSTEM_PROMPT = """You are Jarvis, a highly intelligent AI assistant. You:
- Give concise answers unless asked to elaborate
- Admit when you don't know something
- Ask clarifying questions when a request is ambiguous
- Format responses with markdown when helpful
- Remember context from earlier in the conversation
- Be proactive: if you notice a better way to do something, mention it
Today's date is: {date}
"""

RESEARCH_SYSTEM_PROMPT = """You are an expert research assistant.
Given research data from the web, write a comprehensive, well-structured report.

Your report MUST include these sections:
# Executive Summary
# Key Findings
# Important Facts & Statistics
# Conclusion
# Sources

Use markdown formatting. Be thorough but concise."""


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


# ── Search tools ──────────────────────────────────────────────

def web_search(query: str) -> str:
    """Search DuckDuckGo and return results as text."""
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
    """Fetch readable text from a URL."""
    try:
        headers = {"User-Agent": "Mozilla/5.0 (compatible; ResearchBot/1.0)"}
        resp = requests.get(url, headers=headers, timeout=8)
        soup = BeautifulSoup(resp.text, "html.parser")
        for tag in soup(["script", "style", "nav", "footer", "header"]):
            tag.decompose()
        text = soup.get_text(separator=" ", strip=True)
        return text[:MAX_PAGE_CHARS] + ("..." if len(text) > MAX_PAGE_CHARS else "")
    except Exception as e:
        return f"Could not fetch page: {e}"


# ── Research agent ────────────────────────────────────────────

def run_research_agent(topic: str) -> str:
    """
    Searches the web manually, then asks the model to write a report.
    This approach is more reliable than tool calling with gemma3n.
    """
    print(f"[Research] Searching: {topic}")

    # Run 2 searches for broader coverage
    search1 = web_search(topic)
    search2 = web_search(topic + " latest news facts")

    # Fetch the top result page for deeper content
    page_content = ""
    try:
        with DDGS() as ddgs:
            hits = list(ddgs.text(topic, max_results=1))
        if hits:
            page_content = fetch_page(hits[0]["href"])
            print(f"[Research] Fetched page: {hits[0]['href']}")
    except Exception as e:
        print(f"[Research] Page fetch failed: {e}")

    # Build the combined research context
    context = f"""=== SEARCH RESULTS 1 ===
{search1}

=== SEARCH RESULTS 2 ===
{search2}

=== PAGE CONTENT ===
{page_content}
"""

    # Ask the model to synthesize a report from the gathered data
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
            {"role": "system", "content": SYSTEM_PROMPT.format(date=date.today())}
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
        report = run_research_agent(topic)

        os.makedirs("reports", exist_ok=True)
        safe = "".join(c if c.isalnum() or c in " -_" else "" for c in topic)
        filename = f"reports/{safe[:40].replace(' ','_')}_{date.today()}.md"
        with open(filename, "w", encoding="utf-8") as f:
            f.write(f"# {topic}\n\n{report}")

        return jsonify({"topic": topic, "report": report, "saved_to": filename})

    except Exception as e:
        print(f"[Research ERROR] {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/research/list", methods=["GET"])
def list_reports():
    files = []
    if os.path.exists("reports"):
        files = sorted(os.listdir("reports"), reverse=True)
    return jsonify({"reports": files})


# ── Text to Speech ────────────────────────────────────────────

@app.route("/speak", methods=["POST"])
def speak():
    text     = request.json.get("text", "")
    voice_id = request.json.get("voice_id", "EXAVITQu4vr4xnSDxMaL")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    try:
        client = ElevenLabs(api_key=ELEVENLABS_API_KEY)
        audio = client.text_to_speech.convert(
            voice_id=voice_id,
            text=text,
            model_id="eleven_multilingual_v2",
            voice_settings=VoiceSettings(
                stability=0.5,
                similarity_boost=0.75,
                style=0.5,
                use_speaker_boost=True
            )
        )

        audio_buffer = io.BytesIO()
        for chunk in audio:
            audio_buffer.write(chunk)
        audio_buffer.seek(0)

        return send_file(audio_buffer, mimetype="audio/mpeg", as_attachment=False)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/voices", methods=["GET"])
def get_voices():
    try:
        client = ElevenLabs(api_key=ELEVENLABS_API_KEY)
        voices = client.voices.get_all()
        voice_list = [{"id": v.voice_id, "name": v.name} for v in voices.voices]
        return jsonify({"voices": voice_list})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)