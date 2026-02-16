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

#AI Surgery app UI design

import http.client
import json
import customtkinter as ctk
from PIL import Image
import threading
from tkinter import filedialog
import base64
from io import BytesIO
import time
import socket

# 1. Window Setup
window = ctk.CTk()
ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("dark-blue")
window.title("AI Surgery App")
window.minsize(1000, 800)

window.grid_columnconfigure(0, weight=1)
window.grid_columnconfigure(1, weight=3)
window.grid_rowconfigure(0, weight=1)


# ========== PASTE THE NEW FUNCTIONS HERE ==========

def check_available_models():
    """Check what models are available on your Ollama server"""
    conn = None
    try:
        print("🔍 Checking available models on server...")
        conn = http.client.HTTPSConnection("ai.recepguzel.com", timeout=30)
        headers = {'authorization': "Basic YWl1c2VyOkJ1QWk1UGFyYUV0bWV6IQ=="}

        conn.request("GET", "/api/tags", headers=headers)
        res = conn.getresponse()

        if res.status == 200:
            data = json.loads(res.read().decode("utf-8"))
            print("\n✅ Server response:")
            print(json.dumps(data, indent=2))

            # Extract model names if available
            if "models" in data:
                print("\n📋 Available models:")
                model_names = []
                for model in data["models"]:
                    name = model.get('name', str(model))
                    print(f"  - {name}")
                    model_names.append(name)
                return model_names
            else:
                print("⚠️ No 'models' key in response")
                return []
        else:
            error_body = res.read().decode("utf-8")
            print(f"❌ Error {res.status}: {error_body}")
            return []

    except Exception as e:
        print(f"❌ Error checking models: {e}")
        return []
    finally:
        if conn:
            conn.close()


def ai_analysis(img):
    """10X SMARTER AI Analysis with proper vision model and enhanced medical prompting"""
    conn = None
    try:
        window.after(0, lambda: update_status("🔬 Processing image..."))

        # 1. Process image with higher quality
        img_small = img.copy()
        img_small.thumbnail((1024, 1024))  # Higher resolution for better detail
        buffered = BytesIO()
        img_small.save(buffered, format="PNG", quality=95)
        img_bytes = buffered.getvalue()
        img_str = base64.b64encode(img_bytes).decode("utf-8")

        window.after(0, lambda: update_status("🌐 Connecting to AI server..."))

        # 2. Connection
        conn = http.client.HTTPSConnection("ai.recepguzel.com", timeout=120)  # Longer timeout for complex analysis

        # VISION MODELS ONLY - Prioritized by capability
        models_to_try = [
            "llava:13b",  # Best quality
            "llava:7b",  # Good balance
            "llava:latest",  # Fallback
            "bakllava:latest",  # Alternative
            "llava-llama3",  # Alternative
        ]

        last_error = None

        # Try each model until one works
        for model_name in models_to_try:
            try:
                print(f"🔄 Trying vision model: {model_name}")
                window.after(0, lambda m=model_name: update_status(f"🤖 Testing {m}..."))

                payload_data = {
                    "model": model_name,  # ✅ CRITICAL FIX - Uses actual vision model!
                    "messages": [
                        {
                            "role": "user",
                            "content": """You are an expert medical imaging AI with specialized training in anatomy and clinical diagnostics. Analyze this medical diagram with extreme precision and thoroughness.

🔍 CRITICAL INSTRUCTIONS:
- READ ALL TEXT LABELS in the image carefully - list EVERY labeled structure you can see
- Identify the COMPLETE anatomical system shown (not just the most prominent part)
- If you see labels for "Central Nervous System", "Peripheral Nervous System", "Spinal Cord", "Nerves", etc., YOU MUST MENTION ALL OF THEM

📋 PROVIDE A COMPREHENSIVE ANALYSIS:

**1. BODY PART IDENTIFICATION:**
- Identify the COMPLETE anatomical system/structure shown in this diagram
- State whether this shows a single organ, multiple organs, or an entire body system
- Note if this includes both central and peripheral components

**2. LABELED STRUCTURES (CRITICAL - READ THE IMAGE LABELS):**
- List EVERY structure that has a text label in the image
- For each labeled structure, provide:
  * Anatomical name
  * Location in the body
  * Primary function
  * Key characteristics

**3. ANATOMICAL DETAILS:**
- Describe the spatial relationships between structures
- Explain how different components connect and communicate
- Note any color-coding or visual distinctions in the diagram

**4. PHYSIOLOGICAL FUNCTIONS:**
- Explain how this system/structure works
- Describe the flow of signals, fluids, or materials
- Detail the role in maintaining body homeostasis

**5. CLINICAL RELEVANCE:**
- List 5-7 common medical conditions affecting these structures
- Describe diagnostic procedures used to examine this system
- Mention surgical procedures or treatments related to these structures
- Include prevalence and risk factors where relevant

**6. PATHOLOGICAL CONSIDERATIONS:**
- Describe what happens when these structures are damaged
- Explain symptoms of dysfunction
- Note emergency conditions requiring immediate attention

**7. DIAGNOSTIC IMAGING:**
- What imaging modalities are used to visualize these structures? (MRI, CT, X-ray, ultrasound, etc.)
- When would each imaging type be preferred?

**8. PROFESSIONAL SUMMARY:**
Provide a concise yet comprehensive overview suitable for:
- Medical students studying anatomy
- Healthcare professionals needing a refresher
- Patients seeking to understand their anatomy

⚠️ ACCURACY REQUIREMENTS:
- Base your analysis ONLY on what you actually see in the image
- If you see text labels, you MUST read and include them
- Do not hallucinate structures that aren't labeled or visible
- If the diagram shows a full body system (e.g., nervous system from head to toe), acknowledge the COMPLETE system, not just one part

Be thorough, accurate, and use proper medical terminology throughout your analysis.""",
                            "images": [img_str]
                        }
                    ],
                    "stream": False,
                    "options": {
                        "temperature": 0.3,  # Lower temperature for more accurate, less creative responses
                        "num_predict": 2000,  # Allow longer responses
                    }
                }

                headers = {
                    'content-type': "application/json",
                    'authorization': "Basic YWl1c2VyOkJ1QWk1UGFyYUV0bWV6IQ=="
                }

                # Create new connection for each attempt
                if conn:
                    conn.close()
                conn = http.client.HTTPSConnection("ai.recepguzel.com", timeout=120)
                conn.request("POST", "/api/chat", json.dumps(payload_data), headers)

                res = conn.getresponse()

                if res.status == 200:
                    # Success! Process the response
                    print(f"✅ Vision model {model_name} is analyzing the image!")
                    window.after(0, lambda m=model_name: update_status(
                        f"✅ Using {m}\n\n🔬 Performing deep medical analysis...\n⏳ This may take 30-60 seconds for detailed results...\n"))

                    data = res.read()
                    result = json.loads(data.decode("utf-8"))

                    print(f"Full server response: {result}")

                    # Get response from message format
                    full_response = result.get("message", {}).get("content", "")

                    # Fallback to old format
                    if not full_response:
                        full_response = result.get("response", "")

                    if full_response:
                        window.after(0, lambda: clear_waiting_message())

                        # Format the response for better readability
                        formatted_response = f"""{'=' * 60}
🏥 MEDICAL IMAGING ANALYSIS REPORT
{'=' * 60}

{full_response}

{'=' * 60}
📊 Analysis completed using: {model_name}
⏰ Generated: {time.strftime('%Y-%m-%d %H:%M:%S')}
{'=' * 60}
"""
                        window.after(0, lambda r=formatted_response: update_ui_with_token(r))
                        return  # Success! Exit the function
                    else:
                        raise Exception(f"No response in server reply. Got: {result}")
                else:
                    # This model didn't work, try next one
                    error_body = res.read().decode("utf-8")
                    last_error = f"Model {model_name}: Status {res.status} - {error_body}"
                    print(f"❌ {last_error}")
                    continue

            except Exception as e:
                last_error = f"Model {model_name}: {str(e)}"
                print(f"❌ {last_error}")
                continue

        # If we get here, none of the models worked
        raise Exception(
            f"""❌ NO VISION MODELS AVAILABLE ON SERVER!

You need to install a vision model on your Ollama server.

On your PC, run:
  ollama pull llava:7b

OR for better quality:
  ollama pull llava:13b

Then restart this application.

Last error: {last_error}""")

    except socket.timeout:
        window.after(0, lambda: show_error(
            "⏱️ Server timeout - AI analysis took too long to respond.\n\nTry:\n1. Using a smaller image\n2. Checking server load\n3. Restarting Ollama"))
    except Exception as e:
        error_msg = str(e)
        print(f"❌ Critical Error: {error_msg}")
        window.after(0, lambda m=error_msg: show_error(f"{m}"))
    finally:
        if conn:
            conn.close()

# ========== HELPER FUNCTIONS ==========

def update_status(message):
    """Update status in the result text box"""
    result_text.configure(state="normal")
    current_text = result_text.get("1.0", "end-1c")
    if "please wait" in current_text.lower() or "analyzing" in current_text.lower():
        result_text.delete("1.0", "end")
    result_text.insert("end", f"{message}\n")
    result_text.see("end")
    result_text.configure(state="disabled")


def clear_waiting_message():
    """Clear the waiting message when first token arrives"""
    result_text.configure(state="normal")
    result_text.delete("1.0", "end")
    result_text.configure(state="disabled")


def show_error(error_message):
    """Display error message"""
    result_text.configure(state="normal")
    result_text.delete("1.0", "end")
    result_text.insert("1.0", f"❌ {error_message}\n\nPlease try again or check your connection.")
    result_text.configure(state="disabled")


def update_ui_with_token(token):
    """Update the UI safely from a thread"""
    result_text.configure(state="normal")
    result_text.insert("end", token.replace("**", ""))
    result_text.see("end")
    result_text.configure(state="disabled")


def upload_action():
    path = filedialog.askopenfilename(filetypes=[("Image files", "*.png *.jpg *.jpeg")])
    if path:
        img = Image.open(path)
        img_ctk = ctk.CTkImage(light_image=img, dark_image=img, size=(500, 500))
        image_display.configure(image=img_ctk, text="")
        image_display.image = img_ctk

        result_text.configure(state="normal")
        result_text.delete("1.0", "end")
        result_text.insert("1.0", "AI is analyzing the scan... please wait.")
        result_text.configure(state="disabled")

        thread = threading.Thread(target=ai_analysis, args=(img,), daemon=True)
        thread.start()


# ========== UI COMPONENTS ==========

sidebar = ctk.CTkFrame(window, width=200, corner_radius=0)
sidebar.grid(row=0, column=0, sticky="nsew")

title_app = ctk.CTkLabel(sidebar, text="AI Surgery", font=ctk.CTkFont(family="Open Sans", size=24, weight="bold"))
title_app.pack(pady=20, padx=10)

upload_button = ctk.CTkButton(sidebar, text="Upload scan", font=("Open Sans", 24), command=upload_action)
upload_button.pack(pady=10, padx=10)

main_display = ctk.CTkFrame(window, corner_radius=10)
main_display.grid(row=0, column=1, padx=20, pady=20, sticky="nsew")
main_display.grid_columnconfigure(0, weight=1)
main_display.grid_rowconfigure(0, weight=3)
main_display.grid_rowconfigure(1, weight=1)

image_display = ctk.CTkLabel(main_display, text="Scan will appear here", text_color="gray")
image_display.grid(row=0, column=0, sticky="nsew", padx=10, pady=10)

result_text = ctk.CTkTextbox(main_display, font=("Open Sans", 16), wrap="word", corner_radius=10, border_width=2)
result_text.grid(row=1, column=0, sticky="nsew", padx=15, pady=15)

result_text.insert("1.0", "Awaiting Medical Scan...")
result_text.configure(state="disabled")


# ========== CHECK MODELS ON STARTUP ==========

print("\n" + "="*50)
print("CHECKING SERVER MODELS...")
print("="*50)
available = check_available_models()
if available:
    print(f"\n✅ Found {len(available)} model(s)")
else:
    print("\n⚠️ Could not retrieve model list or NO MODELS INSTALLED")
    print("\n💡 To install a vision model, SSH into your server and run:")
    print("   ollama pull llava")
print("="*50 + "\n")


# ========== START THE APP ==========

window.mainloop()

#Hello world con