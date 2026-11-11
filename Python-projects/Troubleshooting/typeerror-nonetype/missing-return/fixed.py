def average(numbers):
    total = sum(numbers)
    return total / len(numbers)        # hand the value back


scores = [80, 92, 75]
print(round(average(scores), 1))
