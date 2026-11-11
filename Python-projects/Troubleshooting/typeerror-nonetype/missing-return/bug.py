def average(numbers):
    total = sum(numbers)
    result = total / len(numbers)      # computed, but never returned


scores = [80, 92, 75]
print(average(scores)[0])              # TypeError: 'NoneType' object is not subscriptable
