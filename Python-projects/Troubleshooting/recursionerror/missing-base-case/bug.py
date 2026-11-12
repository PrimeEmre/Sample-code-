def countdown(n):
    print(n)
    countdown(n - 1)                   # never stops: there is no base case


countdown(3)                           # RecursionError: maximum recursion depth exceeded
