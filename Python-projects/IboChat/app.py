# -*- coding: utf-8 -*-
import os
import asyncio
import requests
import sqlite3
import time

import edge_tts

from flask import Flask, request, jsonify, render_template, send_from_directory, Response
from flask_cors import CORS
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash

load_dotenv()

# ── App Setup ─────────────────────────────────────────────────
app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY") or os.urandom(32)
CORS(app)

# ── Config ────────────────────────────────────────────────────
ZAI_URL    = "https://open.bigmodel.cn/api/paas/v4/chat/completions"
ZAI_KEY    = os.environ.get("ZAI_API_KEY", "")
MODEL      = os.environ.get("ZAI_MODEL", "glm-4.5-air")
DATABASE   = "ibochat.db"

# Master switch for the real-person features (celebrity voice cloning,
# celebrity photo, Wikipedia grounding). Defaults ON so nothing changes for
# local/personal use. Set ALLOW_REAL_PERSON_VOICES=0 for any build meant for
# app-store distribution — Apple's and Google Play's review policies both
# specifically target apps that clone/impersonate real people's voice or
# likeness, and this flag is what makes that a genuinely unreachable code
# path in that build, not just a promise not to use the feature. Custom
# (user-invented) characters are entirely unaffected either way — they never
# touch any of the endpoints this flag gates.
ALLOW_REAL_PERSON_VOICES = os.environ.get('ALLOW_REAL_PERSON_VOICES', '1') == '1'

# ── Edge TTS voice map  {lang: (female_voice, male_voice)} ────
EDGE_VOICE_MAP = {
    'tr': ('tr-TR-EmelNeural',        'tr-TR-AhmetNeural'),
    'en': ('en-US-AriaNeural',        'en-US-GuyNeural'),
    'es': ('es-ES-ElviraNeural',      'es-ES-AlvaroNeural'),
    'fr': ('fr-FR-DeniseNeural',      'fr-FR-HenriNeural'),
    'de': ('de-DE-KatjaNeural',       'de-DE-ConradNeural'),
    'it': ('it-IT-ElsaNeural',        'it-IT-DiegoNeural'),
    'pt': ('pt-BR-FranciscaNeural',   'pt-BR-AntonioNeural'),
    'ru': ('ru-RU-SvetlanaNeural',    'ru-RU-DmitryNeural'),
    'zh': ('zh-CN-XiaoxiaoNeural',    'zh-CN-YunxiNeural'),
    'ja': ('ja-JP-NanamiNeural',      'ja-JP-KeitaNeural'),
    'ko': ('ko-KR-SunHiNeural',       'ko-KR-InJoonNeural'),
    'ar': ('ar-SA-ZariyahNeural',     'ar-SA-HamedNeural'),
    'hi': ('hi-IN-SwaraNeural',       'hi-IN-MadhurNeural'),
    'nl': ('nl-NL-ColetteNeural',     'nl-NL-MaartenNeural'),
    'pl': ('pl-PL-ZofiaNeural',       'pl-PL-MarekNeural'),
    'sv': ('sv-SE-SofieNeural',       'sv-SE-MattiasNeural'),
    'da': ('da-DK-ChristelNeural',    'da-DK-JeppeNeural'),
    'no': ('nb-NO-PernilleNeural',    'nb-NO-FinnNeural'),
    'ro': ('ro-RO-AlinaNeural',       'ro-RO-EmilNeural'),
    'el': ('el-GR-AthinaNeural',      'el-GR-NestorasNeural'),
    'hu': ('hu-HU-NoemiNeural',       'hu-HU-TamasNeural'),
    'cs': ('cs-CZ-VlastaNeural',      'cs-CZ-AntoninNeural'),
    'fi': ('fi-FI-NooraNeural',       'fi-FI-HarriNeural'),
    'uk': ('uk-UA-PolinaNeural',      'uk-UA-OstapNeural'),
}

# ── Database ──────────────────────────────────────────────────
def init_db():
    with sqlite3.connect(DATABASE) as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id            INTEGER PRIMARY KEY AUTOINCREMENT,
                email         TEXT    NOT NULL UNIQUE,
                password_hash TEXT    NOT NULL
            )
        ''')
        # Separate from the celebrity-voice feature entirely — user-created
        # characters with their own name/personality/voice, no real-person
        # cloning involved. owner_email scopes a user's characters to them;
        # NULL/blank means "visible to anyone" (kept simple for now).
        conn.execute('''
            CREATE TABLE IF NOT EXISTS custom_characters (
                id            TEXT    PRIMARY KEY,
                name          TEXT    NOT NULL,
                personality   TEXT    NOT NULL,
                voice_id      TEXT,
                owner_email   TEXT,
                created_at    REAL    NOT NULL
            )
        ''')
        conn.commit()
        print("Database initialized.")

# ── Auth ──────────────────────────────────────────────────────
def do_register():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400
    email    = data.get('email', '').strip()
    password = data.get('password', '')
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
        if cursor.fetchone():
            return jsonify({"error": "Email address already registered"}), 409
        cursor.execute(
            "INSERT INTO users (email, password_hash) VALUES (?, ?)",
            (email, generate_password_hash(password))
        )
        conn.commit()
    return jsonify({"message": "User registered successfully"}), 201


def do_login():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400
    email    = data.get('email', '').strip()
    password = data.get('password', '')
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT password_hash FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()
    if user and check_password_hash(user[0], password):
        return jsonify({"message": "Login successful"}), 200
    return jsonify({"error": "Invalid email or password"}), 401


@app.route('/register', methods=['POST'])
@app.route('/api/register', methods=['POST'])
def register():
    return do_register()

@app.route('/login', methods=['POST'])
@app.route('/api/login', methods=['POST'])
def login():
    return do_login()


# ── AI Endpoint ───────────────────────────────────────────────
@app.route('/api/gemini', methods=['POST'])
def get_gemini_response():
    try:
        data        = request.get_json()
        user_prompt = data.get('prompt')
        if not user_prompt:
            return jsonify({'error': 'No prompt provided'}), 400
    except Exception:
        return jsonify({'error': 'Invalid JSON'}), 400

    language = data.get('language', '')
    lang_instruction = (
        f"You MUST reply ONLY in {language}. Never use any other language, not even one word. "
        f"Write it the way an educated native {language} speaker actually writes — correct grammar, "
        f"natural word order and sentence structure (not a word-for-word translation from English), "
        f"proper spelling, and every language-specific letter/diacritic exactly right (for example, "
        f"Turkish ı/İ/ş/ğ/ü/ö/ç, German ä/ö/ü/ß, French é/è/ç, etc. — never substitute the plain ASCII "
        f"letter for one of these). If a word or idiom exists in {language} that fits better than a "
        f"literal translation of an English phrase, use it."
    ) if language else "Reply in the same language the user writes in, with correct grammar and natural, native-level phrasing — not a stiff or literal translation."
    # General response-quality instructions, applied here so every caller of
    # this endpoint gets them regardless of what the frontend's own prompt
    # already says — chat.js's per-character prompt (personality, current
    # facts, history, length cap) still does the character-specific framing;
    # this is the backend-side floor underneath all of that.
    quality_instruction = (
        "Stay fully in character at all times. Give a real, specific answer "
        "to what was actually asked — don't deflect into a vague summary or "
        "restate the question back. Avoid generic filler openers (\"Thank "
        "you for your question\", \"That's a great point\", etc.) and don't "
        "repeat phrasing you've already used earlier in this conversation. "
        "Keep the tone natural and conversational, not like a press release."
    )
    system_msg = f"{lang_instruction} {quality_instruction}"

    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system_msg},
            {"role": "user", "content": user_prompt},
        ],
        "stream": True,
        "temperature": 0.8,
        "top_p": 0.9,
    }
    headers = {
        "Authorization": f"Bearer {ZAI_KEY}",
        "Content-Type": "application/json",
    }

    for attempt in range(3):
        try:
            resp = requests.post(ZAI_URL, json=payload, headers=headers, timeout=120, stream=True)
            if resp.status_code == 429:
                time.sleep(2 ** attempt)
                continue
            resp.raise_for_status()

            def generate():
                import json as _json
                for line in resp.iter_lines():
                    if not line:
                        continue
                    text = line.decode('utf-8')
                    if text.startswith('data: '):
                        text = text[6:]
                    if text == '[DONE]':
                        break
                    try:
                        chunk = _json.loads(text)
                        delta = chunk['choices'][0]['delta'].get('content', '')
                        if delta:
                            yield delta
                    except Exception:
                        continue

            from flask import Response, stream_with_context
            return Response(stream_with_context(generate()), mimetype='text/plain')

        except requests.exceptions.ConnectionError:
            return jsonify({'error': 'Cannot connect to Z.ai API'}), 502
        except requests.exceptions.Timeout:
            return jsonify({'error': 'Z.ai API timed out'}), 504
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    return jsonify({'error': 'Rate limit exceeded after 3 retries. Please try again shortly.'}), 429


OMNIVOICE_URL = os.environ.get("OMNIVOICE_URL", "http://localhost:3900")

# ── GPT-SoVITS (faster path for its 5 supported languages) ────
# Standalone server (see C:\Users\emre\GPT-SoVITS, api_v2.py) — only covers
# zh/ja/en/ko/yue, so it's used for English-speaking profiles only; every
# other language stays on OmniVoice above. Generates in ~5-18s on this GPU
# vs ~30-40s+ through OmniVoice's own engines. Maps OmniVoice profile id ->
# (short 3-10s reference clip, GPT-SoVITS language code) since GPT-SoVITS
# has no concept of "profiles" of its own — it just needs a reference clip
# per request, so we reuse the clip already sitting in GPT-SoVITS/voice_refs.
GPT_SOVITS_URL = os.environ.get("GPT_SOVITS_URL", "http://localhost:9880")
# All of the below are specific to whatever machine actually runs GPT-SoVITS —
# every path here is overridable via env var so this isn't hardcoded to one
# developer's PC. Defaults match how this was originally set up locally.
GPT_SOVITS_VOICE_REFS_DIR = os.environ.get("GPT_SOVITS_VOICE_REFS_DIR", r"C:\Users\emre\GPT-SoVITS\voice_refs")

# ── GPT-SoVITS on-demand lifecycle ─────────────────────────────
# GPT-SoVITS's server has no idle-unload of its own — once started it holds
# ~3.9GB of VRAM forever, on a 4GB card. Running it permanently starved
# OmniVoice down to "0.0 GB free", which didn't just slow OmniVoice down —
# it corrupted its internal model-loading state and required a full restart
# to recover. So instead of a long-lived background service, we start
# GPT-SoVITS lazily on first English-celebrity request and let a watchdog
# kill it after a period of disuse, mirroring OmniVoice's own idle-unload.
# NOTE: this on-demand start/stop is itself specific to running GPT-SoVITS on
# the SAME machine as this Flask process. If GPT-SoVITS ends up hosted on a
# separate server, set GPT_SOVITS_MANAGED=0 to disable this local
# process-launching entirely and just call GPT_SOVITS_URL directly.
GPT_SOVITS_MANAGED = os.environ.get("GPT_SOVITS_MANAGED", "1") == "1"
GPT_SOVITS_DIR = os.environ.get("GPT_SOVITS_DIR", r"C:\Users\emre\GPT-SoVITS")
GPT_SOVITS_VENV_PYTHON = os.environ.get(
    "GPT_SOVITS_VENV_PYTHON", os.path.join(GPT_SOVITS_DIR, ".venv", "Scripts", "python.exe")
)
GPT_SOVITS_FFMPEG_BIN = os.environ.get(
    "GPT_SOVITS_FFMPEG_BIN", r"C:\Users\emre\ffmpeg-shared\ffmpeg-9.0.1-full_build-shared\bin"
)
GPT_SOVITS_IDLE_TIMEOUT_S = 120  # shut down 2 min after the last request

_gpt_sovits_process = None
_gpt_sovits_lock = __import__("threading").Lock()
_gpt_sovits_last_used = 0.0
_gpt_sovits_active_requests = 0  # in-flight count — the watchdog must never
                                  # kill the process while this is > 0, or a
                                  # slow generation gets its connection reset
                                  # mid-response (this actually happened).


def _gpt_sovits_is_alive():
    try:
        requests.get(f"{GPT_SOVITS_URL}/", timeout=2)
        return True  # even a 404 means the server answered
    except Exception:
        return False


def _ensure_gpt_sovits_running():
    """Start GPT-SoVITS if it isn't already up, and block until it's actually
    ready to serve (model load takes ~30-50s cold). Returns False on timeout
    so the caller can fall back to OmniVoice/edge-tts instead of hanging.
    If GPT_SOVITS_MANAGED=0 (GPT-SoVITS lives on a different machine than this
    Flask process), this only checks reachability — it never tries to launch
    a local process for a server that isn't local."""
    global _gpt_sovits_process, _gpt_sovits_last_used
    import subprocess
    if not GPT_SOVITS_MANAGED:
        return _gpt_sovits_is_alive()
    with _gpt_sovits_lock:
        _gpt_sovits_last_used = time.time()
        if _gpt_sovits_is_alive():
            return True
        if _gpt_sovits_process is None or _gpt_sovits_process.poll() is not None:
            env = os.environ.copy()
            env["PATH"] = GPT_SOVITS_FFMPEG_BIN + os.pathsep + env.get("PATH", "")
            # Was DEVNULL — discarded every crash traceback, making failures
            # like a mid-request ConnectionResetError unfixable after the
            # fact. Keep a rolling log instead.
            gpt_sovits_log = open(os.path.join(GPT_SOVITS_DIR, "auto_launch.log"), "a", encoding="utf-8")
            _gpt_sovits_process = subprocess.Popen(
                [GPT_SOVITS_VENV_PYTHON, "api_v2.py", "-a", "127.0.0.1", "-p", "9880",
                 "-c", "GPT_SoVITS/configs/tts_infer.yaml"],
                cwd=GPT_SOVITS_DIR, env=env,
                stdout=gpt_sovits_log, stderr=subprocess.STDOUT,
            )
    deadline = time.time() + 90
    while time.time() < deadline:
        if _gpt_sovits_is_alive():
            return True
        time.sleep(2)
    return False


def _gpt_sovits_idle_watchdog():
    while True:
        time.sleep(15)
        with _gpt_sovits_lock:
            if (_gpt_sovits_process is not None and _gpt_sovits_process.poll() is None
                    and _gpt_sovits_active_requests == 0
                    and time.time() - _gpt_sovits_last_used > GPT_SOVITS_IDLE_TIMEOUT_S):
                print("[gpt-sovits] idle — shutting down to free VRAM for OmniVoice")
                _gpt_sovits_process.terminate()
                try:
                    _gpt_sovits_process.wait(timeout=10)
                except Exception:
                    _gpt_sovits_process.kill()


if GPT_SOVITS_MANAGED:
    __import__("threading").Thread(target=_gpt_sovits_idle_watchdog, daemon=True).start()
## GPT-SoVITS's cloning quality depends heavily on `prompt_text` matching what's
# actually said in the reference clip — an empty prompt_text (what we shipped
# initially) measurably hurts how close the clone sounds. Transcribed via
# faster-whisper once, from GPT-SoVITS/voice_refs/transcripts.json.
GPT_SOVITS_VOICE_MAP = {
    # voice_id: (reference wav filename, transcript of that clip)
    "950d940d": ("trump.wav", "It's great to be back in beautiful Davos, Switzerland, and to address so many respected"),
    "7af7fbc1": ("obama.wav", "So I first came to Chicago when I was in my early 20s, and I was still trying to figure out who I was, still searching for a purpose in my life,"),
    "965b7c7e": ("biden.wav", "to the Democrats. My grandfather, Fendingwood, come back from his grave. All right, is Joe Biden running for president? Yes, I-"),
    "2a573afa": ("musk.wav", "And if you have vast numbers of robots with vast amounts of digital intelligence, you have a quasi-infinite economy."),
    "2166c1d5": ("gates.wav", "I saw the tragedy of over 10 million children dying every year. I saw that the vaccines that could save those lives were being given to rich kids"),
    "8f9fbce1": ("freeman.wav", "One of these days, somewhere in the distant future. That won't be me. But there'll be movies. And movies are forever."),
    "2e8c807b": ("arnold.wav", "If I sit low, or it is a chair that leans back, which means comfortable chair, I lose energy. And so I know myself."),
    "95197b83": ("reeves.wav", "In chapter three, Parabellum, there's a lot more knife work and a lot more group work."),
    "b8313953": ("jackma.wav", "Yeah, we have over 100 million buyers visiting our shop and our site every day."),
    "b4693a03": ("ronaldo.wav", "But to be honest and you know that I'm never lie. Well sometimes I'm lie for a good ways."),
}

LANG_TO_OMNIVOICE = {
    'tr': 'Turkish',  'en': 'English',  'es': 'Spanish',  'fr': 'French',
    'de': 'German',   'it': 'Italian',  'pt': 'Portuguese','ru': 'Russian',
    'zh': 'Chinese',  'ja': 'Japanese', 'ko': 'Korean',    'ar': 'Arabic',
    'hi': 'Hindi',    'nl': 'Dutch',    'pl': 'Polish',    'sv': 'Swedish',
    'da': 'Danish',   'no': 'Norwegian','fi': 'Finnish',   'el': 'Greek',
    'hu': 'Hungarian','cs': 'Czech',    'ro': 'Romanian',  'uk': 'Ukrainian',
}

# Language-aware yt-dlp search phrases so we get the celebrity speaking their native language
SEARCH_PHRASES = {
    'tr': '{name} röportaj konuşma',
    'fr': '{name} interview parle',
    'de': '{name} interview spricht',
    'es': '{name} entrevista habla',
    'it': '{name} intervista parla',
    'ar': '{name} مقابلة يتحدث',
    'ja': '{name} インタビュー',
    'ko': '{name} 인터뷰',
    'zh': '{name} 采访 说话',
    'ru': '{name} интервью говорит',
    'pt': '{name} entrevista fala',
}

# Curated sources — specific YouTube videos with clean solo speech, no background music.
# Format: 'normalized name': {'yt_id': '...', 'start': seconds, 'duration': seconds, 'lang': 'xx'}
CELEBRITY_VOICE_SOURCES = {
    'donald trump':     {'yt_id': 'ZUB-cMCBMlI', 'start': 30,  'duration': 60, 'lang': 'en'},
    'trump':            {'yt_id': 'ZUB-cMCBMlI', 'start': 30,  'duration': 60, 'lang': 'en'},
    'barack obama':     {'yt_id': 'OFPIxPd7-oA', 'start': 10,  'duration': 60, 'lang': 'en'},
    'obama':            {'yt_id': 'OFPIxPd7-oA', 'start': 10,  'duration': 60, 'lang': 'en'},
    'elon musk':        {'yt_id': 'cdZZpaB2kDM', 'start': 30,  'duration': 60, 'lang': 'en'},
    'musk':             {'yt_id': 'cdZZpaB2kDM', 'start': 30,  'duration': 60, 'lang': 'en'},
    'joe biden':        {'yt_id': 'vP1RBzMH27Q', 'start': 10,  'duration': 60, 'lang': 'en'},
    'morgan freeman':   {'yt_id': '1Y3ydB5xleQ', 'start': 20,  'duration': 60, 'lang': 'en'},
    'arnold schwarzenegger': {'yt_id': 'PbAoXw_DqvM', 'start': 15, 'duration': 60, 'lang': 'en'},
    'arnold':           {'yt_id': 'PbAoXw_DqvM', 'start': 15,  'duration': 60, 'lang': 'en'},
    'tarkan':           {'yt_id': 'w4VBqGzDmbQ', 'start': 60,  'duration': 60, 'lang': 'tr'},
    'recep tayyip erdogan': {'yt_id': 'EhBZ40BBTOU', 'start': 10, 'duration': 60, 'lang': 'tr'},
    'erdogan':          {'yt_id': 'EhBZ40BBTOU', 'start': 10,  'duration': 60, 'lang': 'tr'},
    'vladimir putin':   {'yt_id': '1KfVUHMSRu4', 'start': 10,  'duration': 60, 'lang': 'ru'},
    'putin':            {'yt_id': '1KfVUHMSRu4', 'start': 10,  'duration': 60, 'lang': 'ru'},
    'emmanuel macron':  {'yt_id': 'pW5vHCQGR3E', 'start': 15,  'duration': 60, 'lang': 'fr'},
    'macron':           {'yt_id': 'pW5vHCQGR3E', 'start': 15,  'duration': 60, 'lang': 'fr'},
    'cristiano ronaldo':{'yt_id': 'TF2CmkmkuyI', 'start': 20,  'duration': 60, 'lang': 'en'},
    'ronaldo':          {'yt_id': 'TF2CmkmkuyI', 'start': 20,  'duration': 60, 'lang': 'en'},
    'lionel messi':     {'yt_id': 'wB3VrqTjWIU', 'start': 10,  'duration': 60, 'lang': 'es'},
    'messi':            {'yt_id': 'wB3VrqTjWIU', 'start': 10,  'duration': 60, 'lang': 'es'},
    'bill gates':       {'yt_id': 'UomjoBSHJnA', 'start': 15,  'duration': 60, 'lang': 'en'},
    'keanu reeves':     {'yt_id': 'iyPeGxSBZN4', 'start': 20,  'duration': 60, 'lang': 'en'},
    'jack ma':          {'yt_id': 'wT3q1qm09os', 'start': 15,  'duration': 60, 'lang': 'en'},
    'mark carney':      {'yt_id': 'BXcmhptH_A4', 'start': 36,  'duration': 33, 'lang': 'en'},
    'carney':           {'yt_id': 'BXcmhptH_A4', 'start': 36,  'duration': 33, 'lang': 'en'},
    'ahmet mahmut unlu':{'yt_id': 'edly2q_2kMM', 'start': 70, 'duration': 45, 'lang': 'tr'},
    'cubbeli ahmet hoca': {'yt_id': 'edly2q_2kMM', 'start': 70, 'duration': 45, 'lang': 'tr'},
}
VOICE_CACHE_DIR = os.path.join(os.path.dirname(__file__), 'voice_cache')
os.makedirs(VOICE_CACHE_DIR, exist_ok=True)

# ── Celebrity avatar image (license-checked) ──────────────────
# A real photo is only ever used if Wikipedia's own file metadata says it's
# actually free to reuse (public domain / CC0 / CC-BY / CC-BY-SA) — most
# photos of public figures on Wikipedia are used there under a "fair use"
# rationale that's valid ONLY inside a Wikipedia article, not for reuse in a
# different app. Anything not clearly marked free is skipped entirely and
# the frontend falls back to the generic silhouette avatar instead.
_CELEBRITY_IMAGE_CACHE = {}  # name_key -> dict result (or None), process-lifetime only

_FREE_LICENSE_HINTS = ('public domain', 'cc0', 'cc-by', 'cc by', 'no known copyright', 'pd-')
_UNFREE_LICENSE_HINTS = ('fair use', 'non-free', 'all rights reserved', 'copyrighted', 'noncommercial')

# Required by Wikimedia's API etiquette policy — requests without an
# identifying User-Agent get a flat 403, no exception, just an HTML error
# body where JSON was expected.
_WIKI_HEADERS = {'User-Agent': 'IboChat/1.0 (voice-chat app; contact via repo owner)'}


def _wiki_langs_to_try(requested_lang):
    """Language subdomains to try, in order. A person known by a name that
    only exists as an article/redirect on their home-country Wikipedia
    (e.g. "Cübbeli Ahmet Hoca" only resolves on tr.wikipedia.org, not
    en.wikipedia.org) was silently coming back empty because this used to
    hardcode English only. English stays as a fallback since it's usually
    the most complete edition, not because it should be tried first."""
    requested_lang = (requested_lang or '').strip().lower()[:2]
    langs = []
    if requested_lang:
        langs.append(requested_lang)
    if 'en' not in langs:
        langs.append('en')
    return langs


@app.route('/api/celebrity-image', methods=['GET'])
def celebrity_image():
    if not ALLOW_REAL_PERSON_VOICES:
        return jsonify({'available': False})

    name = request.args.get('name', '').strip()
    if not name:
        return jsonify({'error': 'name is required'}), 400

    name_key = name.lower()
    if name_key in _CELEBRITY_IMAGE_CACHE:
        cached = _CELEBRITY_IMAGE_CACHE[name_key]
        return jsonify(cached) if cached else jsonify({'available': False})

    result = None
    for wiki_lang in _wiki_langs_to_try(request.args.get('lang')):
        try:
            # 1. Find the Wikipedia article's main image filename.
            page_resp = requests.get(
                f'https://{wiki_lang}.wikipedia.org/w/api.php',
                params={
                    'action': 'query', 'format': 'json', 'prop': 'pageimages',
                    'piprop': 'name', 'titles': name, 'redirects': 1,
                },
                timeout=10, headers=_WIKI_HEADERS,
            )
            page_resp.raise_for_status()
            pages = page_resp.json().get('query', {}).get('pages', {})
            page = next(iter(pages.values()), {})
            filename = page.get('pageimage')
            if not filename:
                continue  # no article/no image in this language — try the next one

            # 2. Look up that specific file's license metadata (same wiki —
            # locally-uploaded files resolve fine there, and shared Commons
            # files are transparently proxied by every language's own API).
            info_resp = requests.get(
                f'https://{wiki_lang}.wikipedia.org/w/api.php',
                params={
                    'action': 'query', 'format': 'json', 'titles': f'File:{filename}',
                    'prop': 'imageinfo', 'iiprop': 'url|extmetadata',
                },
                timeout=10, headers=_WIKI_HEADERS,
            )
            info_resp.raise_for_status()
            info_pages = info_resp.json().get('query', {}).get('pages', {})
            info_page = next(iter(info_pages.values()), {})
            imageinfo = (info_page.get('imageinfo') or [{}])[0]
            extmeta = imageinfo.get('extmetadata', {})

            license_text = ' '.join(str(extmeta.get(k, {}).get('value', ''))
                                     for k in ('License', 'LicenseShortName', 'UsageTerms')).lower()

            is_unfree = any(hint in license_text for hint in _UNFREE_LICENSE_HINTS)
            is_free = any(hint in license_text for hint in _FREE_LICENSE_HINTS)

            # Default to NOT using the image unless it's positively marked
            # free — an unrecognized/missing license tag is treated the same
            # as fair-use, not as "probably fine."
            if is_free and not is_unfree and imageinfo.get('url'):
                artist = extmeta.get('Artist', {}).get('value', '')
                # Artist field often comes back as raw HTML (links etc.) —
                # strip tags for a plain-text attribution line.
                import re as _re
                artist = _re.sub('<[^>]+>', '', artist).strip()
                result = {
                    'available': True,
                    'url': imageinfo['url'],
                    'license': extmeta.get('LicenseShortName', {}).get('value', 'Free license'),
                    'attribution': artist,
                }
                break  # found a usable image — no need to try the next language
        except Exception as e:
            print(f"[celebrity-image] lookup failed for {name!r} on {wiki_lang}.wikipedia.org: {e}")
            continue

    _CELEBRITY_IMAGE_CACHE[name_key] = result
    return jsonify(result) if result else jsonify({'available': False})


# ── Celebrity current-facts grounding ──────────────────────────
# The chat AI's own training data has a cutoff and goes stale on anyone
# whose real-world role changes after that — a roleplay prompt with no
# grounding will confidently deny a title someone has since taken (e.g. "I'm
# not the Prime Minister"). Wikipedia's own intro summary is kept current by
# its editors far more often than any model gets retrained, so pulling a
# short plain-text extract and handing it to the prompt as "here's who you
# currently are" fixes this for any real person, not just one hardcoded fix.
_CELEBRITY_CONTEXT_CACHE = {}

@app.route('/api/celebrity-context', methods=['GET'])
def celebrity_context():
    if not ALLOW_REAL_PERSON_VOICES:
        return jsonify({'summary': None})

    name = request.args.get('name', '').strip()
    if not name:
        return jsonify({'error': 'name is required'}), 400

    name_key = name.lower()
    if name_key in _CELEBRITY_CONTEXT_CACHE:
        return jsonify({'summary': _CELEBRITY_CONTEXT_CACHE[name_key]})

    summary = None
    for wiki_lang in _wiki_langs_to_try(request.args.get('lang')):
        try:
            resp = requests.get(
                f'https://{wiki_lang}.wikipedia.org/w/api.php',
                params={
                    'action': 'query', 'format': 'json', 'prop': 'extracts',
                    'exintro': 1, 'explaintext': 1, 'exsentences': 2,
                    'titles': name, 'redirects': 1,
                },
                timeout=10, headers=_WIKI_HEADERS,
            )
            resp.raise_for_status()
            pages = resp.json().get('query', {}).get('pages', {})
            page = next(iter(pages.values()), {})
            extract = (page.get('extract') or '').strip()
            if extract:
                summary = extract
                break  # found one — no need to try the next language
        except Exception as e:
            print(f"[celebrity-context] lookup failed for {name!r} on {wiki_lang}.wikipedia.org: {e}")
            continue

    _CELEBRITY_CONTEXT_CACHE[name_key] = summary
    return jsonify({'summary': summary})


# ── Celebrity Voices (OmniVoice Studio profiles) ──────────────
@app.route('/api/voices', methods=['GET'])
def list_voices():
    try:
        resp = requests.get(f"{OMNIVOICE_URL}/profiles", timeout=15)
        resp.raise_for_status()
        return jsonify(resp.json())
    except requests.exceptions.ConnectionError:
        return jsonify({'error': 'OmniVoice Studio is not running', 'profiles': []}), 503
    except Exception as e:
        return jsonify({'error': str(e), 'profiles': []}), 500


# ── Auto-create celebrity voice profile ───────────────────────
@app.route('/api/voices/auto-create', methods=['POST'])
def auto_create_voice():
    if not ALLOW_REAL_PERSON_VOICES:
        return jsonify({'error': 'Real-person voice cloning is disabled on this build.'}), 403

    import glob as _glob

    data = request.get_json(silent=True) or {}
    name = data.get('name', '').strip()
    lang = data.get('language', 'en').strip()[:2].lower()
    if not name:
        return jsonify({'error': 'name is required'}), 400

    # Normalize accented chars for lookup and filenames
    _accent_map = str.maketrans('İıĞğÜüŞşÖöÇç', 'IiGgUuSsOoCc')
    ascii_name = name.translate(_accent_map)
    safe_name  = "".join(c for c in ascii_name if c.isalnum() or c in (' ', '-', '_')).strip()
    name_key   = ascii_name.lower().strip()

    # Check curated sources first, then fall back to language from request
    curated = CELEBRITY_VOICE_SOURCES.get(name_key)
    if curated:
        lang = curated['lang']
    omnivoice_lang = LANG_TO_OMNIVOICE.get(lang, 'Auto')

    # 1. Check if profile already exists in OmniVoice
    try:
        resp = requests.get(f"{OMNIVOICE_URL}/profiles", timeout=15)
        profiles = resp.json() if resp.ok else []
        for p in profiles:
            pkey = p.get('name', '').translate(_accent_map).lower().strip()
            if pkey == name_key or p.get('name', '').lower() == name.lower():
                return jsonify({'id': p['id'], 'name': p['name'], 'language': p.get('language'), 'cached': True})
    except requests.exceptions.ConnectionError:
        return jsonify({'error': 'OmniVoice Studio is not running'}), 503

    # 2. Download clean solo-speech audio
    out_path   = os.path.join(VOICE_CACHE_DIR, safe_name)
    audio_file = out_path + '.wav'

    if not os.path.exists(audio_file):
        def _download_and_trim(yt_source, ss, duration):
            import subprocess as _sp
            import sys as _sys
            # sys.executable, not a bare 'python' — a bare string resolves via
            # whatever the OS's PATH happens to put first, which on a machine
            # with multiple Python installs can silently land on one that never
            # had yt-dlp installed, failing every single clone with no useful
            # error. sys.executable is guaranteed to be the interpreter this
            # very process is running under, so `-m yt_dlp` only works if it's
            # actually installed here (see requirements.txt).
            cmd = [_sys.executable, '-m', 'yt_dlp', yt_source,
                   '--extract-audio', '--audio-format', 'mp3', '--audio-quality', '0',
                   '-o', out_path + '_raw.%(ext)s', '--no-playlist', '--quiet',
                   # YouTube's default (web) player response has been returning
                   # a bare HTTP 403 for yt-dlp's usual extraction path — an
                   # ongoing YouTube-vs-yt-dlp arms race, not anything specific
                   # to one video. Forcing the Android client sidesteps it;
                   # this is yt-dlp's own documented workaround, not a hack
                   # specific to this app. Revisit if it stops working again —
                   # that cat-and-mouse fight isn't something we can "fix" for
                   # good, only keep pace with.
                   '--extractor-args', 'youtube:player_client=android']
            dl = _sp.run(cmd, capture_output=True, text=True, timeout=120)
            raw_files = _glob.glob(out_path + '_raw.*')
            if not raw_files:
                print(f"[voice-clone] yt-dlp found no output file for {yt_source!r} "
                      f"(rc={dl.returncode}): {dl.stderr[-500:] if dl.stderr else '(no stderr)'}")
                return False
            trim = _sp.run(['ffmpeg', '-y', '-i', raw_files[0],
                     '-ss', str(ss), '-t', str(duration),
                     '-ar', '22050', '-ac', '1', audio_file], capture_output=True, text=True)
            os.remove(raw_files[0])
            ok = os.path.exists(audio_file)
            if not ok:
                print(f"[voice-clone] ffmpeg trim failed for {yt_source!r} "
                      f"(rc={trim.returncode}): {trim.stderr[-500:] if trim.stderr else '(no stderr)'}")
            return ok

        success = False
        if curated:
            # Try curated source first, fall back to search if unavailable
            yt_url = f"https://www.youtube.com/watch?v={curated['yt_id']}"
            success = _download_and_trim(yt_url, curated['start'], curated['duration'])

        if not success:
            # Generic search fallback: skip first 20s (intro/music), take 45s
            tmpl = SEARCH_PHRASES.get(lang, '{name} interview speaking')
            search_query = tmpl.format(name=name)
            _download_and_trim(f'ytsearch1:{search_query}', 20, 45)

    if not os.path.exists(audio_file):
        return jsonify({'error': f'Could not download audio for {name}'}), 500

    # 3. POST to OmniVoice /profiles to create the clone
    try:
        with open(audio_file, 'rb') as f:
            resp = requests.post(
                f"{OMNIVOICE_URL}/profiles",
                data={'name': name, 'kind': 'clone', 'language': omnivoice_lang},
                files={'ref_audio': (os.path.basename(audio_file), f, 'audio/wav')},
                timeout=60
            )
        if not resp.ok:
            return jsonify({'error': 'OmniVoice profile creation failed', 'detail': resp.text}), 500
        profile = resp.json()
        return jsonify({'id': profile['id'], 'name': profile['name'], 'language': profile.get('language', omnivoice_lang), 'cached': False})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ── Custom characters (safe alternative to real-celebrity cloning) ─
# Entirely separate feature from CELEBRITY_VOICE_SOURCES above: users invent
# their own name + personality and record their OWN voice (or someone else's
# with that person's own consent) rather than a real public figure's. Voice
# cloning goes through the same OmniVoice /profiles endpoint either way —
# OmniVoice doesn't care whether the reference clip came from YouTube or a
# browser mic recording, so no new cloning code is needed, just a different
# source for the reference audio and separate storage for the personality.
import uuid as _uuid


def _normalize_voice_sample_to_wav(file_storage):
    """Re-encode a browser mic recording (48kHz webm/opus) to the same
    22050Hz mono WAV format the celebrity pipeline's ffmpeg trim step
    produces (see the -ar 22050 -ac 1 call above). Sending OmniVoice the raw
    webm/opus straight from MediaRecorder — as this endpoint used to — feeds
    it a container/sample-rate/codec combination it was never validated
    against, and the clone comes out crackly/robotic even though the
    original recording (playable fine in-browser, since browsers decode
    webm/opus natively) is clean. Returns a temp file path to upload, or None
    if ffmpeg isn't available/fails — callers should fall back to the raw
    upload rather than block character creation on this.
    """
    import tempfile, subprocess as _sp

    src_fd, src_path = tempfile.mkstemp(suffix='.webm')
    dst_fd, dst_path = tempfile.mkstemp(suffix='.wav')
    os.close(dst_fd)
    try:
        with os.fdopen(src_fd, 'wb') as f:
            file_storage.save(f)
        result = _sp.run(
            ['ffmpeg', '-y', '-i', src_path, '-ar', '22050', '-ac', '1', dst_path],
            capture_output=True, text=True, timeout=60
        )
        if result.returncode != 0 or not os.path.exists(dst_path) or os.path.getsize(dst_path) == 0:
            print(f"[custom-character] ffmpeg normalize failed: {result.stderr[-500:] if result.stderr else '(no stderr)'}")
            os.remove(dst_path) if os.path.exists(dst_path) else None
            return None
        return dst_path
    except Exception as e:
        print(f"[custom-character] ffmpeg normalize error: {e}")
        if os.path.exists(dst_path):
            os.remove(dst_path)
        return None
    finally:
        if os.path.exists(src_path):
            os.remove(src_path)

@app.route('/api/characters/create', methods=['POST'])
def create_character():
    name        = request.form.get('name', '').strip()
    personality = request.form.get('personality', '').strip()
    owner_email = request.form.get('owner_email', '').strip()
    audio_file  = request.files.get('voice_sample')

    if not name or not personality:
        return jsonify({'error': 'name and personality are required'}), 400

    voice_id = None
    if audio_file and audio_file.filename:
        normalized_path = _normalize_voice_sample_to_wav(audio_file)
        try:
            if normalized_path:
                with open(normalized_path, 'rb') as wav_f:
                    resp = requests.post(
                        f"{OMNIVOICE_URL}/profiles",
                        data={'name': name, 'kind': 'clone', 'language': 'Auto'},
                        files={'ref_audio': ('voice_sample.wav', wav_f, 'audio/wav')},
                        timeout=60
                    )
            else:
                # ffmpeg normalization unavailable/failed — fall back to the
                # raw upload rather than block character creation entirely.
                resp = requests.post(
                    f"{OMNIVOICE_URL}/profiles",
                    data={'name': name, 'kind': 'clone', 'language': 'Auto'},
                    files={'ref_audio': (audio_file.filename, audio_file.stream, audio_file.mimetype or 'audio/wav')},
                    timeout=60
                )
            if resp.ok:
                voice_id = resp.json().get('id')
            else:
                print(f"[custom-character] voice clone failed: {resp.text}")
        except Exception as e:
            print(f"[custom-character] voice clone error: {e}")
        finally:
            if normalized_path and os.path.exists(normalized_path):
                os.remove(normalized_path)
        # No voice recorded, or cloning failed — character still gets
        # created, just falls back to edge-tts like any voice_id-less chat.

    char_id = _uuid.uuid4().hex[:8]
    with sqlite3.connect(DATABASE) as conn:
        conn.execute(
            "INSERT INTO custom_characters (id, name, personality, voice_id, owner_email, created_at) VALUES (?, ?, ?, ?, ?, ?)",
            (char_id, name, personality, voice_id, owner_email or None, time.time())
        )
        conn.commit()

    return jsonify({'id': char_id, 'name': name, 'voice_id': voice_id}), 201


@app.route('/api/characters/<char_id>/reclone', methods=['POST'])
def reclone_character_voice(char_id):
    # Recovery path for characters whose voice clone failed at creation time
    # (most commonly: OmniVoice Studio wasn't running yet) and so were saved
    # with voice_id = NULL permanently — creation never retries automatically.
    # The browser still has the original recording in IndexedDB
    # (character_recording::<id>, see audio-store.js), so instead of asking
    # the user to re-record, chat.js's voice-debug panel can resend that same
    # blob here to try the OmniVoice clone again and patch voice_id in place.
    with sqlite3.connect(DATABASE) as conn:
        conn.row_factory = sqlite3.Row
        row = conn.execute(
            "SELECT id, name FROM custom_characters WHERE id = ?", (char_id,)
        ).fetchone()
    if not row:
        return jsonify({'error': 'character not found'}), 404

    audio_file = request.files.get('voice_sample')
    if not audio_file or not audio_file.filename:
        return jsonify({'error': 'voice_sample is required'}), 400

    normalized_path = _normalize_voice_sample_to_wav(audio_file)
    try:
        if normalized_path:
            with open(normalized_path, 'rb') as wav_f:
                resp = requests.post(
                    f"{OMNIVOICE_URL}/profiles",
                    data={'name': row['name'], 'kind': 'clone', 'language': 'Auto'},
                    files={'ref_audio': ('voice_sample.wav', wav_f, 'audio/wav')},
                    timeout=60
                )
        else:
            resp = requests.post(
                f"{OMNIVOICE_URL}/profiles",
                data={'name': row['name'], 'kind': 'clone', 'language': 'Auto'},
                files={'ref_audio': (audio_file.filename, audio_file.stream, audio_file.mimetype or 'audio/wav')},
                timeout=60
            )
    except Exception as e:
        return jsonify({'error': f'could not reach OmniVoice: {e}'}), 502
    finally:
        if normalized_path and os.path.exists(normalized_path):
            os.remove(normalized_path)

    if not resp.ok:
        return jsonify({'error': f'OmniVoice clone failed: {resp.text}'}), 502

    voice_id = resp.json().get('id')
    if not voice_id:
        return jsonify({'error': 'OmniVoice did not return a profile id'}), 502

    with sqlite3.connect(DATABASE) as conn:
        conn.execute("UPDATE custom_characters SET voice_id = ? WHERE id = ?", (voice_id, char_id))
        conn.commit()

    return jsonify({'id': char_id, 'voice_id': voice_id}), 200


@app.route('/api/characters', methods=['GET'])
def list_characters():
    owner_email = request.args.get('owner_email', '').strip()
    with sqlite3.connect(DATABASE) as conn:
        conn.row_factory = sqlite3.Row
        if owner_email:
            rows = conn.execute(
                "SELECT id, name, personality, voice_id, owner_email FROM custom_characters WHERE owner_email = ? ORDER BY created_at DESC",
                (owner_email,)
            ).fetchall()
        else:
            rows = conn.execute(
                "SELECT id, name, personality, voice_id, owner_email FROM custom_characters ORDER BY created_at DESC"
            ).fetchall()
    return jsonify([dict(r) for r in rows])


@app.route('/api/characters/<char_id>', methods=['GET'])
def get_character(char_id):
    with sqlite3.connect(DATABASE) as conn:
        conn.row_factory = sqlite3.Row
        row = conn.execute(
            "SELECT id, name, personality, voice_id, owner_email FROM custom_characters WHERE id = ?",
            (char_id,)
        ).fetchone()
    if not row:
        return jsonify({'error': 'Character not found'}), 404
    return jsonify(dict(row))


# ── Text-to-Speech ─────────────────────────────────────────────
# voice_id → OmniVoice Studio (celebrity cloned voice, WebSocket PCM16→WAV)
# fallback  → Microsoft Edge Neural TTS (edge-tts, MP3)
@app.route('/speak', methods=['GET'])
def speak():
    from flask import Response, stream_with_context
    import queue, threading

    text     = request.args.get('text', '').strip()
    language = request.args.get('language', 'en').strip()
    gender   = request.args.get('gender', 'female').strip().lower()
    voice_id = request.args.get('voice_id', '').strip()

    if not text:
        return jsonify({'error': 'No text provided'}), 400

    # ── GPT-SoVITS fast path (English-speaking profiles only) ─
    if voice_id and voice_id in GPT_SOVITS_VOICE_MAP:
        ref_filename, ref_prompt_text = GPT_SOVITS_VOICE_MAP[voice_id]
        ref_path = os.path.join(GPT_SOVITS_VOICE_REFS_DIR, ref_filename)
        # OmniVoice's own model can still be resident in VRAM from a previous
        # (non-English) celebrity in the same session — the two fighting over
        # this GPU is what turns GPT-SoVITS's normal 5-18s into 150s+. Flush it
        # first so GPT-SoVITS gets the GPU to itself. Best-effort: if OmniVoice
        # isn't running or the flush fails, proceed anyway rather than block.
        try:
            requests.post(f"{OMNIVOICE_URL}/system/flush-memory", timeout=5)
        except Exception:
            pass
        if not _ensure_gpt_sovits_running():
            print("GPT-SoVITS failed to start in time — falling back to OmniVoice/edge-tts")
        else:
            # Held from here until the response is fully streamed out — not
            # just around the POST — since the watchdog only needs to avoid
            # killing the process while a response is actually in flight, and
            # that includes the streaming phase, not just the initial call.
            global _gpt_sovits_active_requests
            with _gpt_sovits_lock:
                _gpt_sovits_active_requests += 1
            try:
                resp = requests.post(
                    f"{GPT_SOVITS_URL}/tts",
                    json={
                        "text": text,
                        "text_lang": "en",
                        "ref_audio_path": ref_path,
                        "prompt_lang": "en",
                        "prompt_text": ref_prompt_text,
                        # v4's diffusion vocoder quality scales with sample_steps
                        # (default 32) — raising it trades a bit of generation
                        # time for a cleaner, less muffled result. super_sampling
                        # is v4's own audio upscaling pass, off by default.
                        "sample_steps": 64,
                        "super_sampling": True,
                    },
                    # Generation is ~5-18s with the GPU to itself, but has been
                    # observed taking 145s+ under real GPU contention with
                    # OmniVoice — 180s left too thin a margin on top of that
                    # for the response to actually finish streaming back.
                    timeout=(10, 280),
                    stream=True,
                )
                resp.raise_for_status()
                def generate_gptsovits():
                    # Needs its own `global` — the outer function's global
                    # declaration doesn't extend into a nested function. Without
                    # this, the `-= 1` below makes Python treat the name as a
                    # local variable throughout this whole function (per
                    # Python's scoping rules: any assignment anywhere in a
                    # function body makes that name local unless declared
                    # otherwise), so reading it to subtract 1 fails with
                    # UnboundLocalError before it's ever been locally assigned.
                    global _gpt_sovits_active_requests
                    try:
                        for chunk in resp.iter_content(chunk_size=4096):
                            if chunk:
                                yield chunk
                    finally:
                        with _gpt_sovits_lock:
                            _gpt_sovits_active_requests -= 1
                return Response(stream_with_context(generate_gptsovits()), mimetype='audio/wav')
            except Exception as e:
                with _gpt_sovits_lock:
                    _gpt_sovits_active_requests -= 1
                print(f"GPT-SoVITS error: {e} — falling back to OmniVoice/edge-tts")
                # fall through to the OmniVoice path below

    # ── OmniVoice celebrity voice path (OpenAI-compat HTTP) ───
    if voice_id:
        lang_code = language.split('-')[0].lower()[:2]
        omnivoice_lang = LANG_TO_OMNIVOICE.get(lang_code, 'Auto')
        try:
            resp = requests.post(
                f"{OMNIVOICE_URL}/v1/audio/speech",
                json={"model": "omnivoice", "input": text, "voice": voice_id, "language": omnivoice_lang},
                # (connect timeout, read timeout) — generation on this hardware's single
                # GPU worker routinely takes 30-40s+ per sentence, and requests queue up
                # behind each other, so a short read timeout was silently forcing every
                # real chat message to fall back to edge-tts. 120s still wasn't enough
                # under real contention (observed a 120s read timeout on a request that
                # would've finished around 70-90s with the GPU to itself) — matches the
                # GPT-SoVITS path's 280s budget below for the same reason. Fail fast on
                # connect, but give generation room to actually finish.
                timeout=(10, 280),
                stream=True
            )
            resp.raise_for_status()
            content_type = resp.headers.get('content-type', 'audio/mpeg')

            def generate_omnivoice():
                for chunk in resp.iter_content(chunk_size=4096):
                    if chunk:
                        yield chunk

            return Response(stream_with_context(generate_omnivoice()), mimetype=content_type)
        except Exception as e:
            print(f"OmniVoice HTTP error: {e} — falling back to edge-tts")

    # ── Edge TTS fallback ─────────────────────────────────────
    lang_key = language.lower()[:2]
    voices   = EDGE_VOICE_MAP.get(lang_key, ('en-US-AriaNeural', 'en-US-GuyNeural'))
    voice    = voices[1] if gender == 'male' else voices[0]

    q = queue.Queue()

    def run_tts():
        async def fetch():
            try:
                communicate = edge_tts.Communicate(text, voice)
                async for chunk in communicate.stream():
                    if chunk['type'] == 'audio':
                        q.put(chunk['data'])
            finally:
                q.put(None)
        asyncio.run(fetch())

    threading.Thread(target=run_tts, daemon=True).start()

    def generate():
        while True:
            data = q.get()
            if data is None:
                break
            yield data

    return Response(stream_with_context(generate()), mimetype='audio/mpeg')


# ── Server-side speech-to-text (call mode fallback/replacement) ─
# The browser's own SpeechRecognition (Web Speech API) depends on a free,
# undocumented Google backend that this session hit repeated failures
# against — throttled or otherwise unavailable, independent of network,
# browser, or antivirus (all individually ruled out). This endpoint gives
# the call feature a path that doesn't depend on that service at all: the
# browser just records audio and uploads it here: transcription happens
# locally via faster-whisper, no external speech API involved. Runs on CPU
# (not the GPU) specifically so it doesn't compete with OmniVoice/GPT-SoVITS
# for the same constrained 4GB card.
_whisper_model = None

def _get_whisper_model():
    global _whisper_model
    if _whisper_model is None:
        from faster_whisper import WhisperModel
        print("[transcribe] loading faster-whisper model (first use only)...")
        _whisper_model = WhisperModel("small", device="cpu", compute_type="int8")
    return _whisper_model

@app.route('/api/transcribe', methods=['POST'])
def transcribe():
    audio_file = request.files.get('audio')
    if not audio_file:
        return jsonify({'error': 'audio file is required'}), 400
    language = request.args.get('language', '').strip()[:2].lower() or None

    import tempfile
    fd, tmp_path = tempfile.mkstemp(suffix='.webm')
    try:
        with os.fdopen(fd, 'wb') as f:
            audio_file.save(f)
        model = _get_whisper_model()
        segments, info = model.transcribe(tmp_path, language=language, vad_filter=True)
        text = ''.join(seg.text for seg in segments).strip()
        return jsonify({'text': text, 'language': info.language})
    except Exception as e:
        print(f"[transcribe] failed: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


# ── Health check ──────────────────────────────────────────────
@app.route('/api/test', methods=['POST'])
def test_dummy():
    return jsonify({"message": "Backend is running!"})


# ── Favicon / App Icons ───────────────────────────────────────
CHAT_ICON_DIR  = os.path.join(os.path.dirname(__file__), 'Chat_icon')
LOGIN_ICON_DIR = os.path.join(os.path.dirname(__file__), 'Loginicon')

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(CHAT_ICON_DIR, 'favicon.ico', mimetype='image/x-icon')

@app.route('/Chat_icon/<path:filename>')
def chat_icon(filename):
    return send_from_directory(CHAT_ICON_DIR, filename)

@app.route('/Loginicon/<path:filename>')
def loginicon(filename):
    return send_from_directory(LOGIN_ICON_DIR, filename)

# ── PWA: manifest + service worker ─────────────────────────────
# Both served from the repo root (not /static/) on purpose — a service
# worker's scope defaults to the directory it's served from, so sw.js has to
# come from "/" to be allowed to control the whole site rather than just one
# subfolder.
APP_ROOT_DIR = os.path.dirname(__file__)

@app.route('/site.webmanifest')
def site_webmanifest():
    return send_from_directory(APP_ROOT_DIR, 'site.webmanifest', mimetype='application/manifest+json')

@app.route('/sw.js')
def service_worker():
    return send_from_directory(APP_ROOT_DIR, 'sw.js', mimetype='application/javascript')

# ── SEO: robots.txt / sitemap.xml ──────────────────────────────
# Defaults to the real public domain so sitemap.xml works with no configuration;
# a SITE_BASE_URL env var (Netlify dashboard) still overrides it. Search engines
# ignore/penalize a sitemap whose URLs don't match the served domain, so this
# must stay the domain the site is actually served from.
SITE_BASE_URL = os.environ.get('SITE_BASE_URL', 'https://chat.emreguzel.ca').rstrip('/')

@app.route('/8f08d8e39afe8c4c5e4d3a93fbdf04a7.txt')
def indexnow_key():
    # IndexNow site-ownership proof (Bing/DuckDuckGo/Yandex); key must match tools/indexnow_sites.py
    return Response("8f08d8e39afe8c4c5e4d3a93fbdf04a7\n", mimetype='text/plain')

@app.route('/robots.txt')
def robots_txt():
    lines = ["User-agent: *", "Allow: /"]
    if SITE_BASE_URL:
        lines.append(f"Sitemap: {SITE_BASE_URL}/sitemap.xml")
    return Response("\n".join(lines) + "\n", mimetype='text/plain')

@app.route('/sitemap.xml')
def sitemap_xml():
    if not SITE_BASE_URL:
        # Emitting a sitemap with placeholder/wrong URLs is worse than no
        # sitemap at all — search engines flag the mismatch. Refuse instead
        # of guessing a domain.
        return Response(
            "<!-- Set SITE_BASE_URL in .env to your real public domain to enable sitemap.xml -->",
            mimetype='text/plain'
        )
    pages = ['/', '/chat.html', '/ibochatbot.html', '/Login.html', '/register.html', '/create-character.html']
    urls = "\n".join(
        f"  <url><loc>{SITE_BASE_URL}{p}</loc></url>" for p in pages
    )
    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f"{urls}\n"
        '</urlset>\n'
    )
    return Response(xml, mimetype='application/xml')

# ── Pages ─────────────────────────────────────────────────────
@app.route('/')
@app.route('/index.html')
def home():
    return render_template('index.html')

@app.route('/login.html')
def login_page():
    return render_template('Login.html')

@app.route('/register.html')
def register_page():
    return render_template('register.html')

@app.route('/chat.html')
def chat_page():
    return render_template('chat.html')

@app.route('/ibochatbot.html')
def ibochatbot_page():
    return render_template('ibochatbot.html')

@app.route('/create-character.html')
def create_character_page():
    return render_template('create-character.html')


# ── Run ───────────────────────────────────────────────────────
init_db()

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5005, debug=True)