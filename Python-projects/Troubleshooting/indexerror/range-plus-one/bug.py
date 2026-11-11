# BUG: range(len(scores) + 1) goes one step too far, so the last index is 3 in a list that ends at 2.
scores = [90, 80, 70]
for i in range(len(scores) + 1):
    print(scores[i])
