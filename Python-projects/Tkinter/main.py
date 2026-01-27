import tkinter
from tkinter import messagebox


def hello_world_text():
    messagebox.showinfo(title="Message", message="hello, world")


window = tkinter.Tk()
window.title("Hello World GUI")
window.minsize(width=1000, height=1000)
window.config(padx=20, pady=20)

my_label = tkinter.Label(text="Hello world", bg="black", fg="white", font=("Roboto", 34))
my_label.pack()
my_name_lable = tkinter.Label(text="Enter your name ", bg="light blue", fg="black", font=("Roboto", 18))
my_name_lable.pack(pady=12)
my_entry = tkinter.Entry(bg="light green", fg="blue", font=("Roboto", 12))
my_entry.pack(pady=12)
my_button = tkinter.Button(text="click here ", font=("Roboto", 12), bg="blue", fg="white", command=hello_world_text)
my_button.pack()
window.mainloop()
