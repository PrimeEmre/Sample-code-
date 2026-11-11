# BUG: "Ana 17".split() gives 2 parts, but the code asks for a third one.
line = "Ana 17"
parts = line.split()
name, age, city = parts[0], parts[1], parts[2]
print(name, age, city)
