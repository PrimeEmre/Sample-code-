def score(a, b):
    return a * b


score = score(3, 4)                    # score is now the number 12, not the function
print(score(5, 6))                     # TypeError: 'int' object is not callable
