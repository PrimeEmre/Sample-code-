def countdown(n):
    if n < 0:                          # base case: when to stop
        return
    print(n)
    countdown(n - 1)


countdown(3)
