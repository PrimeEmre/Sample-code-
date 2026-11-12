lines = ["id", "10", "20"]            # the first line is a header, not a number
total = 0
for line in lines:
    total += int(line)                 # ValueError: invalid literal for int() with base 10: 'id'
print(total)
