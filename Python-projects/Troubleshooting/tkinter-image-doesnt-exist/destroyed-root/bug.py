# BUG: the image was created for a root window that was destroyed. It is gone with that window.
import tkinter as tk

root = tk.Tk()
logo = tk.PhotoImage(file="icon.png")    # created for the first root
root.destroy()

root2 = tk.Tk()                          # a new root
tk.Label(root2, image=logo).pack()       # the old image no longer exists: TclError
root2.mainloop()
