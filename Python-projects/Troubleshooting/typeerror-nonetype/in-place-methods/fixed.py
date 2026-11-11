names = ["maya", "li", "omar"]
names.sort()                           # in place: do not assign the result
print(names[0])

# or keep the original and get a new list:
ordered = sorted(["maya", "li", "omar"])
print(ordered[0])
