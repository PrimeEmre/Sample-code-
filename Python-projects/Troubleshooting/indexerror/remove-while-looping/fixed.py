# FIX: build a new list instead of changing the one you are looping over.
nums = [1, 2, 3, 4, 5, 6]
odds = [n for n in nums if n % 2 != 0]
print(odds)
