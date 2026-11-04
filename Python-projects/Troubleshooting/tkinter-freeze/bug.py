# BUG: time.sleep() runs on the main thread, so mainloop() cannot redraw or
# handle clicks. The window shows "(Not Responding)" for 3 seconds.
import time
import tkinter as tk


def on_click():
    label.config(text="Loading...")
    time.sleep(3)  # pretend this is an API call
    label.config(text="Done!")


window = tk.Tk()
label = tk.Label(window, text="Click the button", font=("Arial", 14))
label.pack(padx=20, pady=10)
tk.Button(window, text="Start", command=on_click).pack(pady=10)
window.mainloop()
