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

# # Defining the function and veribles 
# def area_of_triangle(base , height):
#     result = (float(base) * float(height)) / 2
#     return result
    
# # Calcualting the result and showing the answer 
# def calcualte_area_show():
    
#     # Getting the base and heihgt 
#    base = input("Please enter the base of the triangle: ")
#    height = input("Please enter the height of the triangle: ")
   
#    #callculating 
#    area = area_of_triangle (base, height)
#    print("The area of the triangle is: " + str(area))
   
# calcualte_area_show()

# If and else 

# Voting 
# age = 18
# if(age >= 18):
#     print("You are eligible for vote")
# else:
#     print ("you are not eligible for vote ")

# age = int(input ("enter your age "))
# if (age >= 18):
#      print("You are eligible for vote")
# else:
#     print ("you are not eligible for vote ")

 # Grade calculator 
# grade = 100

# if (grade <= 100 and grade >= 90):
#     print("A+")
# elif(grade <= 89 and grade >=85):
#     print("A")
# elif (grade <= 84 and grade >= 80):
#     print("A-")
# elif (grade <=79 and grade >=75):
#     print("B+")
# elif(grade <=74 and grade >=70):
#     print("B")
# elif(grade <=74 and grade >=70):
#     print("B")
# elif(grade <=69 and grade >= 65):
#     print("C+")
# elif (grade <=64 and grade >= 60):
#     print("C")
# elif (grade <=59 and grade >= 55):
#     print("D+")
# elif (grade <=54 and grade >= 50):
#     print("D")
# elif grade <= 39 and grade >= 0:
#     print("F")

# grade = int(input("Enter your grade  "))

# if (grade <= 100 and grade >= 90):
#     print("A+")
# elif(grade <= 89 and grade >=85):
#     print("A")
# elif (grade <= 84 and grade >= 80):
#     print("A-")
# elif (grade <=79 and grade >=75):
#     print("B+")
# elif(grade <=74 and grade >=70):
#     print("B")
# elif(grade <=74 and grade >=70):
#     print("B")
# elif(grade <=69 and grade >= 65):
#     print("C+")
# elif (grade <=64 and grade >= 60):
#     print("C")
# elif (grade <=59 and grade >= 55):
#     print("D+")
# elif (grade <=54 and grade >= 50):
#     print("D")
# elif grade <= 39 and grade >= 0:
#     print("F")

#Day Of THe Week Calculator 
# day = 1
# if(day == 1):
#     print("Monday")
# elif (day == 2):
#     print("Tuesday")
# elif (day == 3):
#     print("Wendsday")
# elif (day == 4):
#     print("Thursday")
# elif(day == 5):
#     print("Friday")
# elif(day == 6 ):
#     print("Saturday")
# elif(day == 7):
#     print("Sunday")

# day = int(input("Enter the day of the week "))
# if(day == 1):
#     print("Monday")
# elif (day == 2):
#     print("Tuesday")
# elif (day == 3):
#     print("Wendsday")
# elif (day == 4):
#     print("Thursday")
# elif(day == 5):
#     print("Friday")
# elif(day == 6 ):
#     print("Saturday")
# elif(day == 7):
#     print("Sunday")

#sleep time 
# age = 13
# sleep_time = 12

# if age <= 5:
#     if sleep_time >= 19 or sleep_time < 6:
#         print("You need to go to bed, it's " + str(sleep_time))
#     else:
#         print("Do not go to bed, it's " + str(sleep_time) + " too early")
# elif age <= 10:
#     if sleep_time >= 20 or sleep_time < 6:
#         print("You need to go to bed, it's " + str(sleep_time))
#     else:
#         print("Do not go to bed, it's " + str(sleep_time) + " too early")
# elif age <= 15:
#     if sleep_time >= 22 or sleep_time < 6:
#         print("You need to go to bed, it's " + str(sleep_time))
#     else:
#         print("Do not go to bed, it's " + str(sleep_time) + " too early")

# elif age <= 18:
#     if sleep_time >= 1 or sleep_time < 6: 
#         print("You need to go to bed, it's " + str(sleep_time))
#     else:
#         print("Do not go to bed, it's " + str(sleep_time) + " too early")

# age =int(input("Enter yout age "))
# sleep_time= int(input("Enter the time"))

# if age <= 5:
#     if sleep_time >= 19 or sleep_time < 6:
#         print("You need to go to bed, it's " + str(sleep_time))
#     else:
#         print("Do not go to bed, it's " + str(sleep_time) + " too early")
# elif age <= 10:
#     if sleep_time >= 20 or sleep_time < 6:
#         print("You need to go to bed, it's " + str(sleep_time))
#     else:
#         print("Do not go to bed, it's " + str(sleep_time) + " too early")
# elif age <= 15:
#     if sleep_time >= 22 or sleep_time < 6:
#         print("You need to go to bed, it's " + str(sleep_time))
#     else:
#         print("Do not go to bed, it's " + str(sleep_time) + " too early")

# elif age <= 18:
#     if sleep_time >= 1 or sleep_time < 6: 
#         print("You need to go to bed, it's " + str(sleep_time))
#     else:
#         print("Do not go to bed, it's " + str(sleep_time) + " too early")

# num = 0
# numbers = []
# while num < 6:
#     print("At the top num is %d" % num)
#     numbers.append(num)
#     num = num + 1
#     print("Numbers now:", numbers)

# count =[2,4,6,8,10]
# fruit = ['Apple','Banna', ' watermelon']

# for number in count:
#     print("Lets start counting for 2's %d" % number)

# for fruit_list in fruit:
#     print("Lets see the furit types: %s" % fruit)
