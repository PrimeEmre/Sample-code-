# FIX: create the image after the window that will show it, and say which window owns it.
import tkinter as tk

root = tk.Tk()
root.destroy()

root2 = tk.Tk()
logo = tk.PhotoImage(file="icon.png", master=root2)
tk.Label(root2, image=logo).pack()
root2.mainloop()
