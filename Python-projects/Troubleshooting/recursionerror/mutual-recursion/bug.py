def is_even(n):
    return True if n == 0 else is_odd(n - 1)


def is_odd(n):
    return False if n == 0 else is_even(n - 1)


print(is_even(-1))                     # -1 never reaches 0: the two functions call each other forever
