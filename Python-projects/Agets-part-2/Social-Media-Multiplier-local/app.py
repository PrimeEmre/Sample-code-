from flask import Flask, render_template, request, jsonify, session
from flask import send_from_directory

import requests
import os
import time
import json
from datetime import date
from dotenv import load_dotenv

load_dotenv(override=True)

app = Flask(__name__, static_folder='static', template_folder='templates')
app.secret_key = "hybrid_agent_secret_999"

# ── CONFIGURATION ──────────────────────────────────────────────
CREWAI_CREW_URL    = os.getenv("CREWAI_CREW_URL")
CREWAI_CREW_TOKEN  = os.getenv("CREWAI_CREW_TOKEN")
CREWAI_KICKOFF_URL = f"{CREWAI_CREW_URL}/kickoff"
CREWAI_STATUS_URL  = f"{CREWAI_CREW_URL}/status/{{kickoff_id}}"

ANTHROPIC_API_KEY  = os.getenv("ANTHROPIC_API_KEY", "")   # for Visual Advisor

# ── HEADERS ────────────────────────────────────────────────────
def get_crew_headers():
    return {
        "Authorization": f"Bearer {CREWAI_CREW_TOKEN}",
        "Content-Type":  "application/json",
    }

# ── CREW KICKOFF ────────────────────────────────────────────────
def kickoff_crew(blog_url: str, blog_text: str) -> str:
    payload = {
        "inputs": {
            "blog_url":  blog_url,
            "blog_text": blog_text,
            "today":     str(date.today()),
        }
    }
    print(f"DEBUG kickoff payload: {payload}")
    resp = requests.post(
        CREWAI_KICKOFF_URL,
        headers=get_crew_headers(),
        json=payload,
        timeout=60,
    )
    resp.raise_for_status()
    data = resp.json()
    return data.get("kickoff_id") or data.get("id")


def poll_crew_result(kickoff_id: str):
    url = CREWAI_STATUS_URL.format(kickoff_id=kickoff_id)
    for _ in range(75):
        resp = requests.get(url, headers=get_crew_headers(), timeout=15)
        resp.raise_for_status()
        data = resp.json()
        print(f"DEBUG poll: {data}")
        status = (
            data.get("status") or data.get("state") or data.get("execution_status") or ""
        ).lower()
        print(f"DEBUG status: {status}")
        if status in ("completed", "success", "finished"):
            return (
                data.get("result") or data.get("output") or
                data.get("final_output") or data.get("crew_output") or str(data)
            )
        if status in ("failed", "error"):
            return None
        time.sleep(4)
    return None


# ── VISUAL ADVISOR (Claude) ─────────────────────────────────────
VISUAL_SYSTEM_PROMPT = """You are a Visual Content Strategist.
Given social media posts, suggest what kind of image or graphic should accompany each post.
Respond ONLY with a valid JSON array — no markdown, no explanation, no extra text.
Each element must have these keys:
  "platform"    - the platform name (X, LinkedIn, Instagram, etc.)
  "format"      - one of: infographic, quote card, photo, illustration, carousel, chart
  "description" - 1-2 sentences describing the ideal visual
  "style"       - e.g. "minimalist dark", "bold typography", "warm photography"
  "mood"        - e.g. "professional", "energetic", "calm", "witty"
Example: [{"platform":"LinkedIn","format":"infographic","description":"A clean 3-step process diagram showing the workflow described in the post.","style":"minimal dark","mood":"professional"}]"""


def generate_visual_suggestions(social_posts: str, active_platforms: list) -> str:
    """Call Claude directly to suggest visuals for the generated posts."""
    if not ANTHROPIC_API_KEY:
        return ""

    platform_str = ", ".join(active_platforms) if active_platforms else "X, LinkedIn"
    user_msg = (
        f"Here are the social media posts generated for platforms: {platform_str}\n\n"
        f"{social_posts}\n\n"
        f"Suggest one visual for each platform listed above."
    )

    try:
        resp = requests.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key":         ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
                "content-type":      "application/json",
            },
            json={
                "model":      "claude-haiku-4-5-20251001",
                "max_tokens": 1000,
                "system":     VISUAL_SYSTEM_PROMPT,
                "messages":   [{"role": "user", "content": user_msg}],
            },
            timeout=30,
        )
        resp.raise_for_status()
        raw = resp.json()["content"][0]["text"].strip()
        # Validate it's parseable JSON before returning
        json.loads(raw)
        return raw
    except Exception as e:
        print(f"Visual Advisor error: {e}")
        return ""


# ── ICONS / FAVICON ────────────────────────────────────────────
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
    data      = request.get_json()
    blog_url  = data.get("blog_url",  "").strip()
    blog_text = data.get("blog_text", "").strip()
    platforms = data.get("platforms", ["x", "linkedin"])

    if not blog_url and not blog_text:
        return jsonify({"error": "Please provide a blog_url or blog_text."}), 400

    try:
        # 1. Kick off CrewAI
        kid = kickoff_crew(blog_url, blog_text)

        # 2. Poll for social posts
        output = poll_crew_result(kid)
        if not output:
            return jsonify({"error": "Crew failed or timed out. Check CrewAI logs."}), 500

        # 3. Generate visual suggestions via Claude
        visuals = generate_visual_suggestions(output, platforms)

        # 4. Persist to disk
        os.makedirs("posts", exist_ok=True)
        label = blog_url or blog_text[:40]
        safe  = "".join(c if c.isalnum() else "_" for c in label[:40])
        fname = f"posts/{safe}_{date.today()}.md"
        with open(fname, "w", encoding="utf-8") as f:
            f.write(f"# Social Media Posts — {label}\n\n{output}")
            if visuals:
                f.write(f"\n\n## Visual Suggestions\n\n{visuals}")

        return jsonify({
            "social_posts":        output,
            "visual_suggestions":  visuals,
            "blog_url":            blog_url,
            "blog_text":           blog_text,
            "generated":           str(date.today()),
            "saved_to":            fname,
        })

    except requests.HTTPError as e:
        return jsonify({"error": f"CrewAI error: {e.response.text if e.response else str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)