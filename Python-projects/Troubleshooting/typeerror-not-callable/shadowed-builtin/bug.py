sum = 0                               # this hides Python's built-in sum()
for n in [1, 2, 3]:
    sum += n

print(sum([4, 5, 6]))                  # TypeError: 'int' object is not callable
