"""Standalone Arduino connectivity check -- cycles through every hardware
state so you can confirm wiring/serial without starting the full Flask app.

Usage: python hardware/test_connection.py
"""
import os
import sys
import time

import serial
import serial.tools.list_ports
from dotenv import load_dotenv

load_dotenv(override=True)

STATES = [
    ("0", "IDLE", "Everything off, servo parked at 90 degrees."),
    ("B", "RESEARCHING", "Blue LED (pin 12) should pulse, servo should sweep."),
    ("Y", "DEBATING", "Yellow LED (pin 13) should pulse faster, servo should sweep."),
    ("W", "COMPLETE", "LEDs off, servo should park/stop."),
    ("0", "IDLE", "Back to everything off."),
]

SECONDS_PER_STATE = 4


def find_port() -> str | None:
    env_port = os.getenv("ARDUINO_PORT", "")
    if env_port:
        return env_port

    ports = list(serial.tools.list_ports.comports())
    for p in ports:
        desc = (p.description or "").lower()
        if any(kw in desc for kw in ("arduino", "ch340", "cp210", "usb serial")):
            return p.device

    if ports:
        print("No Arduino-looking device found. Available ports:")
        for p in ports:
            print(f"  {p.device} - {p.description}")
    return None


def main():
    port = find_port()
    if not port:
        print("No serial port found. Is the Arduino plugged in?")
        sys.exit(1)

    print(f"Connecting to {port} ...")
    try:
        conn = serial.Serial(port=port, baudrate=9600, timeout=1)
    except Exception as e:
        print(f"FAILED to open {port}: {e}")
        sys.exit(1)

    time.sleep(2)  # let the board reset after the connection opens
    print(f"Connected on {port}.\n")

    try:
        for signal, name, expectation in STATES:
            print(f"--> Sending '{signal}' ({name}). {expectation}")
            conn.write(signal.encode("utf-8"))
            time.sleep(SECONDS_PER_STATE)
        print("\nDone. If you saw the LEDs/servo react as described, wiring and serial are good.")
    finally:
        conn.close()


if __name__ == "__main__":
    main()
