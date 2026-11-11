# BUG: a list of 3 items has indexes 0, 1 and 2. Index 3 (len(names)) does not exist.
names = ["Ana", "Ben", "Cy"]
print(names[len(names)])
