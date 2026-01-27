# import tkinter
# from tkinter import messagebox


# def hello_world_text():
#     messagebox.showinfo(title="Message", message="hello, world")


# window = tkinter.Tk()
# window.title("Hello World GUI")
# window.minsize(width=1000, height=1000)
# window.config(padx=20, pady=20)

# my_label = tkinter.Label(text="Hello world", bg="black", fg="white", font=("Roboto", 34))
# my_label.pack()
# my_name_lable = tkinter.Label(text="Enter your name ", bg="light blue", fg="black", font=("Roboto", 18))
# my_name_lable.pack(pady=12)
# my_entry = tkinter.Entry(bg="light green", fg="blue", font=("Roboto", 12))
# my_entry.pack(pady=12)
# my_button = tkinter.Button(text="click here ", font=("Roboto", 12), bg="blue", fg="white", command=hello_world_text)
# my_button.pack()
# window.mainloop()

import tkinter
from tkinter import messagebox

# Login form
window = tkinter.Tk()
window.title("Login Form")
window.minsize(1000,1000)
window.config(padx= 20, pady=20)

def login_btn():
    if firt_name_entry.get() and last_name_entry.get() and pasword_entry.get():
        messagebox.showinfo(title="Thank you", message="you have filing the requirements  ")
    else:
        messagebox.showerror(title="Eror", message="You did not fill out the requirements ")

    if firt_name_entry.get().isalpha() and last_name_entry.get().isalpha():
        messagebox.showinfo(message="Valid First name and Last name and you have successfully login ")
    else:
        messagebox.showerror(
            title="Invalid Name",
            message="Please use letters only (no spaces or numbers)."
        )


label_title = tkinter.Label(text="Log in form" , font=("Arial", 34), bg="black" , fg="white")
label_title.pack(pady=12)

label_firstname = tkinter.Label(text="Enter your first name" , font=("Arial",18) , bg="black", fg="white")
label_firstname.pack(pady=12)

firt_name_entry = tkinter.Entry(bg="black" , fg="white" ,font=("Arial" ,12),)
firt_name_entry.pack(pady=12)

label_lastname = tkinter.Label(text="Enter your last name" , font=("Arial",18) , bg="black", fg="white")
label_lastname.pack(pady=12)

last_name_entry = tkinter.Entry(bg="black" , fg="white" ,font=("Arial" ,12),)
last_name_entry.pack(pady=12)

password_lable = tkinter.Label(text="Enter your password" , font=("Arial", 12),bg="black" , fg="white")
password_lable.pack(pady=12)

pasword_entry = tkinter.Entry(font=("Arial" , 12),bg="black" ,fg="white")
pasword_entry.pack(pady=12)

login_button = tkinter.Button(text="Login" , font=("Arial" ,12 ), bg="black" , fg="white" , command=login_btn)
login_button.pack()

window.mainloop()
