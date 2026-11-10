# FIX: create the window first, then the image.
import tkinter as tk

window = tk.Tk()
logo = tk.PhotoImage(file="icon.png")
tk.Label(window, image=logo).pack()
window.mainloop()
