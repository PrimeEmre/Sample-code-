# ⏱️ The Hardware-Integrated AI Pomodoro Manager

A Pomodoro timer built on a real Arduino, wired to a Python script that kicks off a cloud AI research crew
and reads the result back to you out loud when your session ends.

---

## 📖 Overview

An Arduino runs the actual Pomodoro clock — countdown, LEDs, a physical switch — completely on its own.
When a work session ends (or you flip a manual switch), it sends a single line over serial to a Python
script running on the connected PC. That script kicks off a [CrewAI Enterprise](https://crewai.com) crew
in the cloud, polls it until it finishes, and speaks the result aloud with a local, offline
text-to-speech model ([KittenTTS](https://github.com/KittenML/KittenTTS)) — so the break itself becomes a
short spoken research briefing.

The Arduino side needs no network connection at all; only the Python side talks to the internet, and only
to reach the crew endpoint.

---

## ✨ Features

- **Physical countdown** — a 4-digit 7-segment display counts down `MM:SS`, driven entirely by the Arduino's
  own clock (no dependency on the PC being connected for timekeeping).
- **Two switches** — one starts/pauses the timer, the other manually forces an AI run at any time.
- **Status LEDs** — one shows the timer is running, the other pulses while the AI crew is working and turns
  off once it reports back.
- **Cloud AI research crew** — on trigger, the host machine kicks off a deployed CrewAI crew and polls it to
  completion, no local LLM required.
- **Spoken summaries** — the crew's result is read aloud sentence-by-sentence with a local TTS model, so you
  don't have to look at a screen during your break.

---

## 🛠️ Hardware Setup

### Required Components

| Component | Notes | Quantity |
|---|---|---|
| Microcontroller | Arduino Uno / Nano (or compatible) | 1 |
| 4-Digit 7-Segment Display | Common cathode | 1 |
| LED | Pomodoro (work) status | 1 |
| LED | AI status | 1 |
| Push Button / Switch | Start/Pause timer | 1 |
| Push Button / Switch | Manual AI trigger | 1 |
| Resistors | Current-limiting, segments + LEDs | as needed |
| Breadboard + jumper wires | — | as needed |

### Pin Assignments

These come directly from [hardware.ino](hardware.ino):

| Arduino Pin | Connected To | Purpose |
|---|---|---|
| D2–D9 | 7-segment segments A–F, DP | Segment control (`segmentPins[8]`) |
| D10–D13 | Digit 1–4 select | Digit multiplexing (`digitPins[4]`) |
| A0 | Timer switch | Start / pause the countdown |
| A1 | Pomodoro LED | Solid while the timer is running |
| A2 | AI status LED | Pulses while the crew is running, solid/off otherwise |
| A3 | Manual AI switch | Forces a `TRIGGER_AI` signal at any time |

> The countdown starts at 5 minutes and resets to 5 minutes after each cycle (`minutes = 5` in
> [hardware.ino](hardware.ino)) — adjust that constant in the sketch if you want a different default length.

### Flashing

Upload [hardware.ino](hardware.ino) to the board with the Arduino IDE or `arduino-cli`. There's no build
configuration beyond the sketch itself.

---

## 🔌 Serial Protocol

The Arduino and Python script talk over a two-message, newline-delimited protocol at **9600 baud**:

| Direction | Message | Meaning |
|---|---|---|
| Arduino → Python | `TRIGGER_AI` | Sent when the countdown hits zero, or the manual AI switch is pressed. Starts the AI status LED blinking. |
| Python → Arduino | `AI_DONE` | Sent once the crew run finishes (success, failure, or timeout) so the LED always stops blinking. |

`AI_DONE` is sent from a `finally` block in [main.py](main.py), so the LED never gets stuck blinking even if
the crew call errors out or the poll loop times out.

---

## 🚀 Installation

### Prerequisites

- Python 3
- An Arduino flashed with [hardware.ino](hardware.ino), connected over USB
- A deployed CrewAI Enterprise crew (URL + bearer token)
- [eSpeak NG](https://github.com/espeak-ng/espeak-ng) installed, for KittenTTS — on Windows, the default
  winget install path is picked up automatically

### Steps

```bash
git clone <this-repo>
cd The-Hardware-Integrated-AI-Pomodoro-Manager--local
pip install pyserial python-dotenv requests kittentts soundfile
```

Create a `.env` file in the project root:

```bash
ARDUINO_PORT=COM3            # or /dev/ttyACM0 on Linux, /dev/tty.usbmodemXXXX on macOS
CREWAI_CREW_URL=https://your-crew-endpoint
CREWAI_CREW_TOKEN=your-bearer-token
OMNIVOICE_VOICE=expr-voice-2-m   # optional, defaults shown
```

Run it:

```bash
python main.py
```

The script connects to the Arduino, waits for `TRIGGER_AI`, then kicks off the crew and speaks the result.

> **Platform note:** playback uses `winsound`, so spoken summaries currently only play on Windows. The
> serial/crew logic itself is platform-agnostic.

---

## 📋 Usage

1. Power on the Arduino and start `python main.py` — it will report once it's connected and listening.
2. Flip the timer switch to start the countdown.
3. When the timer hits zero, or you press the manual AI switch, the AI status LED starts blinking and the
   crew kicks off automatically.
4. Once the crew finishes, its result is printed to the console and spoken aloud; the LED stops blinking.

---

## 🏗️ Project Structure

```
.
├── main.py         # Host-side script: serial listener, CrewAI kickoff/poll, TTS playback
├── hardware.ino     # Arduino firmware: countdown, display multiplexing, switches, LEDs
├── .env             # Local config (not committed): ARDUINO_PORT, CREWAI_CREW_URL, CREWAI_CREW_TOKEN, OMNIVOICE_VOICE
└── README.md
```

---

## ⚠️ Troubleshooting

| Issue | Solution |
|---|---|
| `Serial Connection Error` on startup | Check the Arduino is plugged in and `ARDUINO_PORT` in `.env` matches its actual port (Device Manager on Windows, `ls /dev/tty*` on Linux/macOS). |
| Crew never seems to finish | Check `CREWAI_CREW_URL`/`CREWAI_CREW_TOKEN` are correct; the script gives up after 300 seconds (`POLL_TIMEOUT_SECONDS`) and logs a timeout message. |
| No audio during playback | TTS playback uses `winsound`, so it only plays on Windows. |
| KittenTTS fails to load / phonemizer errors | Make sure eSpeak NG is installed; on Windows the script only auto-detects the default winget path (`C:\Program Files\eSpeak NG`). |
| 7-segment display shows wrong digits | Double check the `segmentPins`/`digitPins` wiring against [hardware.ino](hardware.ino). |
| AI status LED stuck on | Confirm the Python process is still running and reachable — it's the one responsible for sending `AI_DONE` back. |

---

<div align="center">

Built by PrimeEmre

</div>
