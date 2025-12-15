import customtkinter
# Setting up the main window
window = customtkinter.CTk()
window.title("Calculator")
window.geometry("1000x1000")

customtkinter.set_appearance_mode('dark')
customtkinter.set_default_color_theme("dark-blue")


# Function to get first number
def get_first_num():
    return enter_number_entry.get()


# Function to get second number
def get_second_num():
    return second_num_entry.get()


# Handling dropdown selection
def dropdown(selection):
    selected_calc_options.set(selection)


# Function to calculate result
def result():
    try:
        num1 = float(get_first_num())
        num2 = float(get_second_num())
        operation = selected_calc_options.get()

        # Operations
        if operation == '+':
            res = num1 + num2
        elif operation == "-":
            res = num1 - num2
        elif operation == "*":
            res = num1 * num2
        elif operation == "/":
            if num2 == 0:
                result_label.configure(text='Cannot divide by 0')
                return
            res = num1 / num2
        else:
            result_label.configure(text='Select an operation')
            return

        # Display result
        result_label.configure(text=f"Result: {res}")

    except ValueError:
        result_label.configure(text="Enter valid numbers!")


# UI Elements
calculator_title = customtkinter.CTkLabel(window, text="Calculator", font=("Arial", 25))
calculator_title.pack(pady=13)

first_num_label = customtkinter.CTkLabel(window, text="Enter first number", font=('Arial', 15, 'bold'))
first_num_label.pack(pady=3)

enter_number_entry = customtkinter.CTkEntry(window, font=("Arial", 12, 'italic'), width=150)
enter_number_entry.pack()

# Setting the dropdown
selected_calc_options = customtkinter.StringVar(value="Select a calc option")

# Setting calc options
calc_options = ['+', '-', '*', '/']
dropdown = customtkinter.CTkOptionMenu(window, variable=selected_calc_options, values=calc_options, command=dropdown)
dropdown.pack(pady=5)

# Setting the second entry
num_label_second = customtkinter.CTkLabel(window, text="Enter second number", font=("Arial", 15, 'bold'))
num_label_second.pack(pady=3)

second_num_entry = customtkinter.CTkEntry(window, font=('Arial', 12, 'italic'), width=150)
second_num_entry.pack(pady=3)

# Result button
result_button = customtkinter.CTkButton(window, font=("Arial", 12, 'italic'), text="Result", command=result)
result_button.pack(pady=5)

# Result label
result_label = customtkinter.CTkLabel(window, text="", font=("Arial", 14, "bold"))
result_label.pack(pady=5)

window.mainloop()