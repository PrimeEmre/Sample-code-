# FIX: keep a reference to the PhotoImage for as long as the widget needs it.
import tkinter as tk

root = tk.Tk()


def show():
    logo = tk.PhotoImage(file="icon.png")
    label = tk.Label(root, image=logo)
    label.image = logo                   # the reference that keeps the image alive
    label.pack()
    return label


label = show()
root.update()
print("images Tk still has:", root.tk.call("image", "names"))     # pyimage1 is in this list
label.configure(image=label.cget("image"))
root.mainloop()
