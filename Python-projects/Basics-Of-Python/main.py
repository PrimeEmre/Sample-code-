# calculation and writng  our first program in python
# print ("hello , world ")
# print(100 + 100) 
# print((200 + 500) *4 +200 - 890)

#veribles 
# num_1 = 100
# num_2 = 500
# print (num_1 + num_2)

# name = "Emre"
# age = 20
# print ("My name is " + name + " and I am " + str(age) + " years old.")

# age = 30 
# name = "James Smith"
# job = " software developer"
# print  ("my name is" + " " + name +"."+ " " "I am "  + str(age) + " " + "years old." + " My job is" + job +"." )

# lists in python
# my_list = [10,20,30,40,50]
# print (len(my_list))

# fruit_list = ['apple:', 100, 'banana:', 50, 'cherry:',75]
# print (fruit_list)

# car = list (( "bmw", "audi", "toyota", "ferrari"))
# print (car)

# coding_list = ["python", "java", "c++", "javascript", "ruby"]
# print (coding_list [2:4])

# Functions 

# def hello():
#     print ("hello , world ")
#     print ("Welcome to Python programming.")
# hello()

# def country_function(country = "Turkey "):
#     print( "I am from", country)
# country_function("Germany")
# country_function("USA")
# country_function("Dubai")
# country_function("Italy")
# country_function("Canada")

# def furit_list():
#     return ["apple", "banana", "cherry", "date"]
# fruits = furit_list()
# print (fruits [0])
# print (fruits [2])
# print (fruits [3])

# def expensive_car(* cars):
#     print ("The most expensive car in the world is " + cars[0])

# expensive_car("Bugatti Chiron" , "Rolls-Royce Sweptail" , "Pagani Zonda HP Barchetta")

#Making equation from python using function 
# def area_of_tringangle(area):
#     result = area  * (4*2) /2 
#     return result
    
# print (area_of_tringangle(10))
# print (area_of_tringangle (100))
# print (area_of_tringangle (78))

def area_of_triangle():
    base = (input ("Please enter the base of the triangle "))
    height = (input ("Please enter the height  of the triangle "))
    
def calculate_ara(base, height):
    print ("The area of the triangle is: " + str((base * height) / 2))
    
    def calcuate_area(base, height):
        area_of_triangle (base, height)
        equation = (base * height) / 2
        
        
        
        
        
# def get_input(a,b):
#     a = int(input("Please enter the width: \n"))
#     b = int(input("Please enter the length: \n"))

# def show_area(c):
#     print("The area of the rectangle is: {c}".format(c))
    
# def calculate_area(a,b):
#     get_input(a,b)
#     c=a*b
#     show_area(c)    
    
# calculate_area(a,b)