# FIX: run the slow job in a thread. The thread only puts its result in a queue;
# the MAIN thread checks the queue with after() and updates the widgets.
import queue
import threading
import time
import tkinter as tk

results = queue.Queue()


def work():
    time.sleep(3)  # pretend this is an API call (runs in the background thread)
    results.put("Done!")


def check_queue():
    try:
        label.config(text=results.get_nowait())
    except queue.Empty:
        window.after(100, check_queue)  # nothing yet, look again in 100 ms


def on_click():
    label.config(text="Loading...")
    threading.Thread(target=work, daemon=True).start()
    check_queue()


window = tk.Tk()
label = tk.Label(window, text="Click the button", font=("Arial", 14))
label.pack(padx=20, pady=10)
tk.Button(window, text="Start", command=on_click).pack(pady=10)
window.mainloop()
