def factorial(n):
    if n < 0:
        raise ValueError("factorial needs n >= 0")
    if n <= 1:                         # <= is safer than ==
        return 1
    return n * factorial(n - 1)


print(factorial(5))
