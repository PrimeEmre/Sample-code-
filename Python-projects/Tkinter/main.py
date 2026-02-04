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

# import tkinter
# from tkinter import messagebox

# # Login form
# window = tkinter.Tk()
# window.title("Login Form")
# window.minsize(1000,1000)
# window.config(padx= 20, pady=20)

# def login_btn():
#     if firt_name_entry.get() and last_name_entry.get() and pasword_entry.get():
#         messagebox.showinfo(title="Thank you", message="you have filing the requirements  ")
#     else:
#         messagebox.showerror(title="Eror", message="You did not fill out the requirements ")

#     if firt_name_entry.get().isalpha() and last_name_entry.get().isalpha():
#         messagebox.showinfo(message="Valid First name and Last name and you have successfully login ")
#     else:
#         messagebox.showerror(
#             title="Invalid Name",
#             message="Please use letters only (no spaces or numbers)."
#         )


# label_title = tkinter.Label(text="Log in form" , font=("Arial", 34), bg="black" , fg="white")
# label_title.pack(pady=12)

# label_firstname = tkinter.Label(text="Enter your first name" , font=("Arial",18) , bg="black", fg="white")
# label_firstname.pack(pady=12)

# firt_name_entry = tkinter.Entry(bg="black" , fg="white" ,font=("Arial" ,12),)
# firt_name_entry.pack(pady=12)

# label_lastname = tkinter.Label(text="Enter your last name" , font=("Arial",18) , bg="black", fg="white")
# label_lastname.pack(pady=12)

# last_name_entry = tkinter.Entry(bg="black" , fg="white" ,font=("Arial" ,12),)
# last_name_entry.pack(pady=12)

# password_lable = tkinter.Label(text="Enter your password" , font=("Arial", 12),bg="black" , fg="white")
# password_lable.pack(pady=12)

# pasword_entry = tkinter.Entry(font=("Arial" , 12),bg="black" ,fg="white")
# pasword_entry.pack(pady=12)

# login_button = tkinter.Button(text="Login" , font=("Arial" ,12 ), bg="black" , fg="white" , command=login_btn)
# login_button.pack()

# window.mainloop()

# import tkinter
#
# window = tkinter.Tk()
# window.title("Hello World GUI")
# window.minsize(width=1000, height=1000)
# window.config(padx=20, pady=20)
#
# my_label = tkinter.Label(text="Hello world", bg="black", fg="white", font=("Roboto", 24))
# my_label.pack()
# my_name_lable = tkinter.Label(text="Enter your name " ,bg="light blue" , fg="black", font=("Roboto" ,18))
# my_name_lable.pack(pady=12)
# my_entry = tkinter.Entry(bg="light green", fg="blue", font=("Roboto", 12))
# my_entry.pack(pady= 12)
#
# window.mainloop()

# login form

# import tkinter
# from tkinter import messagebox
# # Login form
# window = tkinter.Tk()
# window.title("Login Form")
# window.minsize(1000,1000)
# window.config(padx= 20, pady=20)
#
# def login_btn():
#     if firt_name_entry.get() and last_name_entry.get() and pasword_entry.get():
#         messagebox.showinfo(title="Thank you", message="you have filing the requirements  ")
#     else:
#         messagebox.showerror(title="Eror", message="You did not fill out the requirements ")
#
#     if firt_name_entry.get().isalpha() and last_name_entry.get().isalpha():
#         messagebox.showinfo(message="Valid First name and Last name and you have successfully login ")
#     else:
#         messagebox.showerror(
#             title="Invalid Name",
#             message="Please use letters only (no spaces or numbers)."
#         )
#
#
# label_title = tkinter.Label(text="Log in form" , font=("Arial", 34), bg="black" , fg="white")
# label_title.pack(pady=12)
#
# label_firstname = tkinter.Label(text="Enter your first name" , font=("Arial",18) , bg="black", fg="white")
# label_firstname.pack(pady=12)
#
# firt_name_entry = tkinter.Entry(bg="black" , fg="white" ,font=("Arial" ,12),)
# firt_name_entry.pack(pady=12)
#
# label_lastname = tkinter.Label(text="Enter your last name" , font=("Arial",18) , bg="black", fg="white")
# label_lastname.pack(pady=12)
#
# last_name_entry = tkinter.Entry(bg="black" , fg="white" ,font=("Arial" ,12),)
# last_name_entry.pack(pady=12)
#
# password_lable = tkinter.Label(text="Enter your password" , font=("Arial", 12),bg="black" , fg="white")
# password_lable.pack(pady=12)
#
# pasword_entry = tkinter.Entry(font=("Arial" , 12),bg="black" ,fg="white")
# pasword_entry.pack(pady=12)
#
# login_button = tkinter.Button(text="Login" , font=("Arial" ,12 ), bg="black" , fg="white" , command=login_btn)
# login_button.pack()
#
# window.mainloop()


 # Calculator
# # Importing modules
# import tkinter

# # Setting the GUI
# window = tkinter.Tk()
# window.title("Calcualtor")
# window.minsize(1000, 1000)
# window.config(pady=20, padx=20)

# #setting the backend
# def get_first_num():
#     first_num_entry.get()

# def get_second_num():
#     second_num_entry.get()

# def dropdwon(selection):
#     math_opratins.set(selection)


# def clacualte_btn():
#     try:
#         num1 = float(first_num_entry.get())
#         num2 = float(second_num_entry.get())
#         operation = selceted_math_options.get()

#         res = None  # Initialize result variable

#         if operation == '+':
#             res = num1 + num2
#         elif operation == "-":
#             res = num1 - num2
#         elif operation == "*":
#             res = num1 * num2
#         elif operation == "/":
#             if num2 == 0:
#                 result_label.configure(text="Error: Division by zero")
#                 return
#             res = num1 / num2
#         else:
#             result_label.configure(text="Select an operation")
#             return

#         result_label.configure(text=f"Result: {res}")

#     except ValueError:
#         result_label.configure(text="Invalid input! Enter numbers.")






# # Setting the frontend of GUI
# calcualtor_heding = tkinter.Label(text="Calculator", bg="black", fg="white", font=("Open Sans",32))
# calcualtor_heding.pack(pady=20)

# first_num = tkinter.Label(text="Enter your first num", font=("Open Sans",18), bg="black", fg="white")
# first_num.pack()

# first_num_entry = tkinter.Entry(font=("Open Sans", 18), bg="black" , fg="white")
# first_num_entry.pack(pady=20)

# second_num = tkinter.Label(text="Enter second num",font=("Open Sans", 18),bg="black" , fg="white")
# second_num.pack(pady=2)
# second_num_entry = tkinter.Entry(font=("Open Sans", 18),bg="black" , fg="white")
# second_num_entry.pack()

# #dropdown
# selceted_math_options = tkinter.StringVar(window)
# selceted_math_options.set("Select the math operation")

# math_opratins = ["+" , "-" , "*" , "/"]
# dropdown = tkinter.OptionMenu(window , selceted_math_options, *math_opratins)
# dropdown.pack(pady=2)

# calcualte_btn = tkinter.Button(text="calculate", font=("Open Sans",12), bg="black", fg="white",command=clacualte_btn)
# calcualte_btn.pack()

# result_label = tkinter.Label(window, text="", font=("Arial", 14, "bold"))
# result_label.pack(pady=5)

# window.mainloop()

# profetinal calculator 

# import customtkinter
# # Setting up the main window
# window = customtkinter.CTk()
# window.title("Calculator")
# window.geometry("1000x1000")

# customtkinter.set_appearance_mode('dark')
# customtkinter.set_default_color_theme("dark-blue")


# # Function to get first number
# def get_first_num():
#     return enter_number_entry.get()


# Function to get second number
# def get_second_num():
#     return second_num_entry.get()


# # Handling dropdown selection
# def dropdown(selection):
#     selected_calc_options.set(selection)


# # Function to calculate result
# def result():
#     try:
#         num1 = float(get_first_num())
#         num2 = float(get_second_num())
#         operation = selected_calc_options.get()

#         # Operations
#         if operation == '+':
#             res = num1 + num2
#         elif operation == "-":
#             res = num1 - num2
#         elif operation == "*":
#             res = num1 * num2
#         elif operation == "/":
#             if num2 == 0:
#                 result_label.configure(text='Cannot divide by 0')
#                 return
#             res = num1 / num2
#         else:
#             result_label.configure(text='Select an operation')
#             return

#         # Display result
#         result_label.configure(text=f"Result: {res}")

#     except ValueError:
#         result_label.configure(text="Enter valid numbers!")


# # UI Elements
# calculator_title = customtkinter.CTkLabel(window, text="Calculator", font=("Arial", 25))
# calculator_title.pack(pady=13)

# first_num_label = customtkinter.CTkLabel(window, text="Enter first number", font=('Arial', 15, 'bold'))
# first_num_label.pack(pady=3)

# enter_number_entry = customtkinter.CTkEntry(window, font=("Arial", 12, 'italic'), width=150)
# enter_number_entry.pack()

# # Setting the dropdown
# selected_calc_options = customtkinter.StringVar(value="Select a calc option")

# # Setting calc options
# calc_options = ['+', '-', '*', '/']
# dropdown = customtkinter.CTkOptionMenu(window, variable=selected_calc_options, values=calc_options, command=dropdown)
# dropdown.pack(pady=5)

# # Setting the second entry
# num_label_second = customtkinter.CTkLabel(window, text="Enter second number", font=("Arial", 15, 'bold'))
# num_label_second.pack(pady=3)

# second_num_entry = customtkinter.CTkEntry(window, font=('Arial', 12, 'italic'), width=150)
# second_num_entry.pack(pady=3)

# # Result button
# result_button = customtkinter.CTkButton(window, font=("Arial", 12, 'italic'), text="Result", command=result)
# result_button.pack(pady=5)

# # Result label
# result_label = customtkinter.CTkLabel(window, text="", font=("Arial", 14, "bold"))
# result_label.pack(pady=5)

# window.mainloop()

#BMI calcualtor 

# import tkinter
# from tkinter import messagebox

# window = tkinter.Tk()
# window.minsize(1000, 1000)
# window.title("BMI App")
# window.config(pady=2, padx=2)


# # Setting up the backend and setting the BMI clacualtions
# def calcualte_bmi():
#     try:
#         age = int(age_entry.get())
#         heigth = int(height_entry.get())
#         weight = int(weight_entry.get())

#         heigth_calcualte = heigth / 100
#         bmi = weight / (heigth_calcualte ** 2)
#         result_label.config(text=f"Your BMI is: {bmi:.2f}")

#         # setting the bmi
#         if bmi < 16:
#             messagebox.showinfo(title="BMI Status", message="Underweight")  # Added Title
#         elif 16 <= bmi < 17:
#             messagebox.showinfo(title="BMI Status", message="Moderately underweight")
#         elif 17 <= bmi < 18:
#             messagebox.showinfo(title="BMI Status", message="Slightly underweight")
#         elif 18 <= bmi < 25:
#             messagebox.showinfo(title="BMI Status", message="normal  weight")
#         elif 25 <= bmi < 30:
#             messagebox.showinfo(title="BMI Status",message="Overweight")
#         elif 30 <= bmi < 35:
#             messagebox.showinfo( title="BMI Status" ,message="Obese Class I")
#         elif 35 <= bmi < 40:
#             messagebox.showinfo( title="BMI Status",message="Obese Class II")
#         else:
#             messagebox.showinfo( title="BMI Status",message="Obese Class III")
#     except ValueError:
#         messagebox.showerror("Input error", "Please enter valid numbers for age, height, and weight")


# # Setting the frontedn
# bmi_title = tkinter.Label(text="BMI", font=("Bitcount Single", 34), bg="light blue", fg="black")
# bmi_title.pack(pady=12)

# age_label = tkinter.Label(text="Enter your age ", font=("Bitcount Single", 18), bg="light grey", fg="dark blue")
# age_label.pack()
# age_entry = tkinter.Entry(font=("Bitcount Single", 15), bg="black", fg="white", width=10)
# age_entry.pack(pady=20)

# height_label = tkinter.Label(text="Enter your height", font=("Bitcount Single", 18), bg="light grey", fg="dark blue")
# height_label.pack()

# height_entry = tkinter.Entry(font=("Bitcount Single", 15), bg="black", fg="white", width=10)
# height_entry.pack(pady=12)

# wieght_label = tkinter.Label(text="Enter your weight", font=("Bitcount Single", 15), bg="light grey", fg="dark blue")
# wieght_label.pack(pady=2)

# weight_entry = tkinter.Entry(font=("Bitcount Single", 15), bg="black", fg="white", width=10)
# weight_entry.pack(pady=12)

# calcualte_btn = tkinter.Button(text="Calculate your btn", font=("Bitcount Single", 15), bg="black", fg="white",
#                                width=20, command=calcualte_bmi)
# calcualte_btn.pack()

# result_label = tkinter.Label(text='', font=('Arial', 15))
# result_label.pack(pady=10)

# window.mainloop()

#Profetinal BMI calculator

# import customtkinter
# from tkinter import messagebox
# window = customtkinter.CTk()
# window.geometry("1000x1000")
# window.title("BMI app")



# def calcualte_bmi():
#     try:
#         age = int(age_entry.get())
#         heigth = int(height_entry.get())
#         weight = int(weight_entry.get())

#         heigth_calcualte = heigth / 100
#         bmi = weight / (heigth_calcualte ** 2)
#         result_label.configure(text=f"Your BMI is: {bmi:.2f}")

#         # setting the bmi
#         if bmi < 16:
#             messagebox.showinfo(title="BMI Status", message="Underweight")  # Added Title
#         elif 16 <= bmi < 17:
#             messagebox.showinfo(title="BMI Status", message="Moderately underweight")
#         elif 17 <= bmi < 18:
#             messagebox.showinfo(title="BMI Status", message="Slightly underweight")
#         elif 18 <= bmi < 25:
#             messagebox.showinfo(title="BMI Status", message="normal  weight")
#         elif 25 <= bmi < 30:
#             messagebox.showinfo(title="BMI Status",message="Overweight")
#         elif 30 <= bmi < 35:
#             messagebox.showinfo( title="BMI Status" ,message="Obese Class I")
#         elif 35 <= bmi < 40:
#             messagebox.showinfo( title="BMI Status",message="Obese Class II")
#         else:
#             messagebox.showinfo( title="BMI Status",message="Obese Class III")
#     except ValueError:
#         messagebox.showerror("Input error", "Please enter valid numbers for age, height, and weight")


# # Setting the frontedn
# bmi_title = customtkinter.CTkLabel(window, text="BMI", font=("Arial", 34))
# bmi_title.pack(pady=12)

# age_label = customtkinter.CTkLabel(window, text="Enter your age", font=("Arial", 18))
# age_label.pack()
# age_entry = customtkinter.CTkEntry(window, width=150)
# age_entry.pack(pady=10)

# height_label = customtkinter.CTkLabel(window, text="Enter your height (cm)", font=("Arial", 18))
# height_label.pack()
# height_entry = customtkinter.CTkEntry(window, width=150)
# height_entry.pack(pady=10)

# weight_label = customtkinter.CTkLabel(window, text="Enter your weight (kg)", font=("Arial", 18))
# weight_label.pack()
# weight_entry = customtkinter.CTkEntry(window, width=150)
# weight_entry.pack(pady=10)

#  # Step 7: The Calculate Button
# calc_btn = customtkinter.CTkButton(window, text="Calculate BMI", command=calcualte_bmi)
# calc_btn.pack(pady=20)

# result_label = customtkinter.CTkLabel(window, text="", font=("Arial", 15))
# result_label.pack(pady=10)

# window.mainloop()

#Weather app

# import tkinter
# import requests

# # APi key
# # 6ed4f81aa0ad45d082c34616250612

# api_key = "6ed4f81aa0ad45d082c34616250612"
# api_url = 'http://api.weatherapi.com/v1/current.json'


# def find_location():
#     location = location_entry.get()
#     params = {
#         'key': api_key,
#         'q': location,
#         'aqi': 'no'  # Optional: set to 'yes' if you want air quality data
#     }
#     responce = requests.get(api_url, params=params)
#     data = responce.json()
#     temp = data['current']['temp_c']
#     condition = data['current']['condition']['text']
#     result.config(text=f"Temp: {temp}°C\nSky: {condition}")


# window = tkinter.Tk()
# window.minsize(1000, 1000)
# window.title("Weather app")
# window.config(padx=2, pady=2)

# wheater_title = tkinter.Label(text="Weather app", font=("Bungee", 34), bg="Dodger blue", fg="black")
# wheater_title.pack(pady=30)

# location_label = tkinter.Label(text="Please enter your location", font=("Bungee", 18), bg="Dodger blue", fg="black")
# location_label.pack()

# location_entry = tkinter.Entry(font=("Bungee", 18), bg="Dodger blue", fg='black')
# location_entry.pack(pady=20)

# find_loacation = tkinter.Button(text="Find Location", font=("Bungee", 12), bg='Dodger blue', fg="black",
#                                 command=find_location)
# find_loacation.pack(pady=10)

# result = tkinter.Label(text="", font=("Bungee", 12), bg="Dodger blue", fg="black")
# result.pack()

# window.mainloop()


#Adding image in tkinter 
# import tkinter
# import requests
# from PIL import Image, ImageTk
# from io import BytesIO

# APi key
# 6ed4f81aa0ad45d082c34616250612

# api_key = "6ed4f81aa0ad45d082c34616250612"
# api_url = 'http://api.weatherapi.com/v1/current.json'


# def find_location():
#     location = location_entry.get()
#     params = {
#         'key': api_key,
#         'q': location,
#         'aqi': 'no'  # Optional: set to 'yes' if you want air quality data
#     }
#     responce = requests.get(api_url, params=params)
#     data = responce.json()
#     temp = data['current']['temp_c']
#     condition = data['current']['condition']['text']
#     icon_url = "https:" + data['current']['condition']['icon']

#     # creating whether icon
#     image_response = requests.get(icon_url)
#     image_data = Image.open(BytesIO(image_response.content))
#     weather_icon = ImageTk.PhotoImage(image_data)

#     result.config(text=f"Temp: {temp}°C\nSky: {condition}", image=weather_icon, compound="top")
#     result.image = weather_icon


# window = tkinter.Tk()
# window.minsize(1000, 1000)
# window.title("Weather app")
# window.config(padx=2, pady=2)

# wheater_title = tkinter.Label(text="Weather app", font=("Bungee", 34), bg="Dodger blue", fg="black")
# wheater_title.pack(pady=30)

# location_label = tkinter.Label(text="Please enter your location", font=("Bungee", 18), bg="Dodger blue", fg="black")
# location_label.pack()

# location_entry = tkinter.Entry(font=("Bungee", 18), bg="Dodger blue", fg='black')
# location_entry.pack(pady=20)

# find_loacation = tkinter.Button(text="Find Location", font=("Bungee", 12), bg='Dodger blue', fg="black",
#                                 command=find_location)
# find_loacation.pack(pady=10)

# result = tkinter.Label(text="", font=("Bungee", 12), bg="Dodger blue", fg="black")
# result.pack()

# window.mainloop()

#weather app profetinal  
# Setting the modeuls and window
# import customtkinter
# import requests
# from PIL import Image, ImageTk
# from io import BytesIO

# window = customtkinter.CTk()
# window.minsize(1000, 1000)
# window.title("Weather app")
# window.config(padx=2, pady=2)

# APi key
# 6ed4f81aa0ad45d082c34616250612

# api_key = "6ed4f81aa0ad45d082c34616250612"
# api_url = 'http://api.weatherapi.com/v1/current.json'


# def find_location():
#     location = location_entry.get()
#     params = {
#         'key': api_key,
#         'q': location,
#         'aqi': 'no'  # Optional: set to 'yes' if you want air quality data
#     }
#     responce = requests.get(api_url, params=params)
#     data = responce.json()
#     temp = data['current']['temp_c']
#     condition = data['current']['condition']['text']
#     icon_url = "https:" + data['current']['condition']['icon']

#     # creating whether icon
#     image_response = requests.get(icon_url)
#     image_data = Image.open(BytesIO(image_response.content))
#     weather_icon = ImageTk.PhotoImage(image_data)

#     result.configure(text=f"Temp: {temp}°C\nSky: {condition}", image=weather_icon, compound="top")
#     result.image = weather_icon


# #setting the UI

# wheater_title = customtkinter.CTkLabel(window, text="Weather app", font=("Bungee", 34))
# wheater_title.pack(pady=30)

# location_label = customtkinter.CTkLabel(window, text="Please enter your location", font=("Bungee", 18))
# location_label.pack()

# location_entry = customtkinter.CTkEntry(window, font=("Bungee", 18))
# location_entry.pack(pady=20)

# find_loacation = customtkinter.CTkButton(window, text="Find Location", font=("Bungee", 12), command=find_location)
# find_loacation.pack(pady=10)

# result = customtkinter.CTkLabel(window, text="", font=("Bungee", 12), )
# result.pack()

# window.mainloop()




#YouTube MP4 downloader

#Setting the modules  and window
# import customtkinter
# import yt_dlp

# window = customtkinter.CTk()
# window.minsize(1000,1000)
# window.title("Youtube Download")
# window.config(padx=2,pady=2)

# #setting the backend

# #Setting the progress bar
# def progress_hook(d):
#     if d['status'] == 'downloading':
#         # Use .get to prevent crashes if the values are missing
#         total = d.get('total_bytes') or d.get('total_bytes_estimate')
#         downloaded = d.get('downloaded_bytes', 0)

#         if total:
#             percentage_decimal = downloaded / total

#             progress_bar.set(percentage_decimal)
#             percentage_label.configure(text=f"{int(percentage_decimal * 100)}%")
#             window.update_idletasks()  # This "forces" the 0% to change

#     elif d['status'] == 'finished':
#         percentage_label.configure(text="100% - You are good to go", text_color='green')
#         progress_bar.set(1)



# # Setting the MP4 downloader
# def downlad_btn ():
#     url = url_entry.get()
#     if not url:
#         print("please enter a valid URL ")
#         return

#     options = {
#         'format': 'best',
#         'outtmpl': r'C:\Users\ynsem\Downloads\%(title)s.%(ext)s',
#         'noplaylist': True,
#         'progress_hooks': [progress_hook],
#         # ADD THIS LINE TO FIX THE 403 ERROR:
#         'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
#     }

#     try:
#          with yt_dlp.YoutubeDL(options) as yt_dl:
#             yt_dl.download([url])
#             print("success!")
#     except Exception as e:
#         print(f"Download failed: {e}")

# #Setting the UI

# title_youtube = customtkinter.CTkLabel(window,text="Youtube Downloader ",font=("Roboto",34))
# title_youtube.pack(pady=2)

# downlad_title = customtkinter.CTkLabel(window , text="Download your video" , font=("Roboto", 18))
# downlad_title.pack(pady=10 )

# url_entry= customtkinter.CTkEntry(window , placeholder_text="Plase paste your Youtube link here .... ", width=400 , font=("Roboto" , 12))
# url_entry.pack(pady=10)

# dwonlad_btn = customtkinter.CTkButton(window,text="download now" ,font=("Roboto" ,16,),fg_color="red" , hover_color="darkred" , command= downlad_btn)
# dwonlad_btn.pack()

# percentage_label = customtkinter.CTkLabel(window, text="0%", font=("Roboto", 12))
# percentage_label.pack()

# progress_bar = customtkinter.CTkProgressBar(window, width=400)
# progress_bar.set(0)
# progress_bar.pack(pady=10)

# window.mainloop()

import customtkinter as ctk
from tkinter import filedialog
from PIL import Image, ImageTk


#Setting the window 
window = ctk.CTk()
ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("dark-blue")
window.title("AI Sergeroy app ")
window.minsize(1000,800)
window.config(padx=5, pady=5)
window.grid_columnconfigure(1, weight=3) # Main area is 3x larger than sidebar
window.grid_rowconfigure(0, weight=1)


#Setting the UI


sidebar = ctk.CTkFrame(window, width=200, corner_radius=0)
sidebar.grid(row=0, column=0, sticky="nsew")

title_app = ctk.CTkLabel(sidebar, text="AI Surgery", font=ctk.CTkFont(family="Open Sans", size=24, weight="bold"))
title_app.pack(pady=20, padx=10)

upload_button = ctk.CTkButton(sidebar, text="Upload scan", font=("Open Sans", 24))
upload_button.pack(pady=10, padx=10)





window.mainloop()
