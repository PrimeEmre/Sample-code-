def factorial(n):
    if n == 0:                         # the base case is only reached from 0
        return 1
    return n * factorial(n - 1)


print(factorial(-3))                   # -3, -4, -5 ... never hits 0: RecursionError
