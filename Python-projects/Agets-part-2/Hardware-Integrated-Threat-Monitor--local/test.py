import serial
import time

print("Attempting to connect to COM9...")

try:
    arduino = serial.Serial("COM9", 9600, timeout=1)
    time.sleep(2)
    print("✅ SUCCESS! Connected to COM9.")
    print("Sending 'C' to turn on the Red LED...")
    arduino.write(b'C')
    print("Check your Arduino! The red LED should be on right now.")
except Exception as e:
    print("❌ FAILED! Could not connect.")
    print("Here is the exact error message from Python:")
    print("-" * 40)
    print(e)
    print("-" * 40)