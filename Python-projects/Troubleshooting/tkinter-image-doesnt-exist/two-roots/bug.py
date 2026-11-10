# BUG: a second tk.Tk() creates a second, separate Tcl interpreter. The image belongs to the first one.
import tkinter as tk

first = tk.Tk()
second = tk.Tk()                         # a second root window
logo = tk.PhotoImage(file="icon.png")    # created for the first root

tk.Label(second, image=logo).pack()      # used in the second root: TclError
second.mainloop()
