from flask import Flask, render_template, request, jsonify, session, send_file
from elevenlabs.client import ElevenLabs
from elevenlabs import VoiceSettings
import requests
import json
import os
import io
from datetime import date

app = Flask(__name__)
app.secret_key = "emre_ai_secret_123"

# ── Your ElevenLabs API key ───────────────────────────────────
ELEVENLABS_API_KEY = "your api key"  # ← ONLY change this line

SYSTEM_PROMPT = """You are Jarvis, a highly intelligent AI assistant. You:
- Give concise answers unless asked to elaborate
- Admit when you don't know something
- Ask clarifying questions when a request is ambiguous
- Format responses with markdown when helpful
- Remember context from earlier in the conversation
- Be proactive: if you notice a better way to do something, mention it
Today's date is: {date}
"""

MAX_HISTORY = 20

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

@app.route("/")
def home():
    session["history"] = []
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
        "model": "gemma3n",
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT.format(date=date.today())}
        ] + history,
        "stream": False,
        "options": {"temperature": 0.7, "top_p": 0.9, "repeat_penalty": 1.1}
    }

    try:
        response   = requests.post("http://localhost:11434/api/chat", json=payload, timeout=120)
        result     = response.json()
        ai_message = result["message"]["content"]

        history.append({"role": "assistant", "content": ai_message})
        session["history"] = history
        save_history(user_id, history)

        return jsonify({"response": ai_message})

    except Exception as e:
        return jsonify({"response": f"Error: {str(e)}"}), 500


# ── Text to Speech using ElevenLabs ──────────────────────────
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


# ── Get ElevenLabs Voices ─────────────────────────────────────
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