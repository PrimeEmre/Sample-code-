lines = ["id", "10", "20"]
total = 0
for line in lines[1:]:                 # skip the header
    total += int(line)
print(total)
