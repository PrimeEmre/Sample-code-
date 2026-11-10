# BUG: logo is a local variable. When show() returns, Python deletes the PhotoImage and Tk deletes the image.
import tkinter as tk

root = tk.Tk()


def show():
    logo = tk.PhotoImage(file="icon.png")
    label = tk.Label(root, image=logo)
    label.pack()
    return label


label = show()
root.update()
print("images Tk still has:", root.tk.call("image", "names"))     # no pyimage1 in this list
label.configure(image=label.cget("image"))                       # uses the deleted image: TclError
root.mainloop()
