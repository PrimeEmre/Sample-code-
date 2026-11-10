# BUG: the PhotoImage is created before any window exists.
import tkinter as tk

logo = tk.PhotoImage(file="icon.png")    # RuntimeError: no default root window yet

window = tk.Tk()
tk.Label(window, image=logo).pack()
window.mainloop()
