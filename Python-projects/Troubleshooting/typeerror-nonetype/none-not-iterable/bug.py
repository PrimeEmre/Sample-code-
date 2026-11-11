def find_even(numbers):
    evens = []
    for n in numbers:
        if n % 2 == 0:
            evens.append(n)
    # forgot: return evens


for n in find_even([1, 2, 3, 4]):      # TypeError: 'NoneType' object is not iterable
    print(n)
