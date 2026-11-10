# FIX: one tk.Tk() per program. Extra windows are tk.Toplevel.
import tkinter as tk

root = tk.Tk()
second = tk.Toplevel(root)               # an extra window that shares the same interpreter
logo = tk.PhotoImage(file="icon.png")

tk.Label(second, image=logo).pack()
root.mainloop()
