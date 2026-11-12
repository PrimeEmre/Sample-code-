text = ""
try:
    number = int(text)
except ValueError:
    number = 0                         # or ask again
print(number)
