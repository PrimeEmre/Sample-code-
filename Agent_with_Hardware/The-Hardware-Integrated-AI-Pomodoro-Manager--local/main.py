import os
import re
import serial
import tempfile
import time
import winsound
import requests
import truststore
from dotenv import load_dotenv

# Use Windows' own certificate trust store instead of certifi's bundled one,
# so HTTPS requests still verify correctly when Kaspersky (or similar AV)
# intercepts TLS traffic with its own locally-trusted root certificate.
truststore.inject_into_ssl()

# KittenTTS needs eSpeak NG's DLL on PATH; point at the default winget install
# location so this works regardless of the shell's own PATH being stale.
_ESPEAK_DIR = r"C:\Program Files\eSpeak NG"
_ESPEAK_DLL = os.path.join(_ESPEAK_DIR, "libespeak-ng.dll")
if os.path.isfile(_ESPEAK_DLL):
    os.environ.setdefault("PHONEMIZER_ESPEAK_LIBRARY", _ESPEAK_DLL)
    if _ESPEAK_DIR not in os.environ.get("PATH", ""):
        os.environ["PATH"] = _ESPEAK_DIR + os.pathsep + os.environ.get("PATH", "")

load_dotenv()

# Reads from .env; update ARDUINO_PORT there to match your exact Arduino port
SERIAL_PORT = os.getenv('ARDUINO_PORT', '/dev/ttyACM0')
BAUD_RATE = 9600

# Deployed CrewAI Enterprise crew (runs in the cloud, no local LLM key needed)
CREW_URL = os.getenv('CREWAI_CREW_URL')
CREW_TOKEN = os.getenv('CREWAI_CREW_TOKEN')
POLL_SECONDS = 2
POLL_TIMEOUT_SECONDS = 300

# Voice used to read the crew's result aloud during the break
OMNIVOICE_VOICE = os.getenv('OMNIVOICE_VOICE', 'expr-voice-2-m')
_tts_model = None


def speak(text):
    global _tts_model
    from kittentts import KittenTTS
    import soundfile as sf

    if _tts_model is None:
        print("Loading voice model...")
        _tts_model = KittenTTS()

    # KittenTTS's nano model fails on long, multi-sentence text (onnxruntime
    # "invalid expand shape" on /bert/Expand), so speak it one sentence at a time.
    sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', text) if s.strip()]
    wav_path = os.path.join(tempfile.gettempdir(), "pomodoro_summary.wav")
    for sentence in sentences:
        audio = _tts_model.generate(sentence, voice=OMNIVOICE_VOICE)
        sf.write(wav_path, audio, 24000)
        winsound.PlaySound(wav_path, winsound.SND_FILENAME)


def run_crew(arduino):
    # Tell the Arduino to start blinking the red AI-status LED, and make
    # sure we always tell it to stop, however this run ends up finishing.
    try:
        headers = {
            "Authorization": f"Bearer {CREW_TOKEN}",
            "Content-Type": "application/json",
        }
        inputs = {
            'topic': 'local LLM orchestration frameworks and physical hardware integration'
        }

        response = requests.post(f"{CREW_URL}/kickoff", json={"inputs": inputs}, headers=headers)
        response.raise_for_status()
        kickoff_id = response.json()["kickoff_id"]
        print(f"Crew kicked off (id={kickoff_id}), waiting for it to finish...")

        elapsed = 0
        status = {}
        while elapsed < POLL_TIMEOUT_SECONDS:
            time.sleep(POLL_SECONDS)
            elapsed += POLL_SECONDS

            status_response = requests.get(f"{CREW_URL}/status/{kickoff_id}", headers=headers)
            status_response.raise_for_status()
            status = status_response.json()

            state = str(status.get("state") or status.get("status") or "").upper()
            print(f"Status: {status}")
            if state in ("SUCCESS", "COMPLETED", "FAILED", "ERROR"):
                break
        else:
            print("Timed out waiting for the crew to finish.")
            return

        result = status.get("result") or status.get("output") or status
        print("\nResult:")
        print(result)

        if isinstance(result, str):
            speak(result)
    finally:
        arduino.write(b"AI_DONE\n")


def listen_and_trigger():
    print(f"Connecting to Arduino on {SERIAL_PORT}...")

    try:
        # Establish connection to the Arduino
        arduino = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
        time.sleep(2)  # Give the Arduino a moment to reset upon connection

        print("Connected! Listening for the Pomodoro timer or manual switch...")

        while True:
            # Check if the Arduino has sent any text
            if arduino.in_waiting > 0:
                raw = arduino.readline()
                message = raw.decode('utf-8', errors='replace').strip()

                if not message:
                    continue

                # Print anything the Arduino sends so wiring/firmware issues
                # are visible instead of silently swallowed.
                if message != "TRIGGER_AI":
                    print(f"[Arduino] {message!r}")
                    continue

                print("\nSignal received! Triggering the AI research crew...")
                run_crew(arduino)
                print("\nResearch complete and summarized!")
                print("Listening for the next trigger...\n")

    except serial.SerialException as e:
        print(f"\nSerial Connection Error: {e}")
        print("Check if the Arduino is plugged in and the SERIAL_PORT in .env is correct.")
    except Exception as e:
        print(f"\nAn unexpected error occurred: {e}")


if __name__ == "__main__":
    listen_and_trigger()
