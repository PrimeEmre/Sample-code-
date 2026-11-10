# FIX: nonlocal tells Python that n belongs to the enclosing function.
def counter():
    n = 0

    def inc():
        nonlocal n
        n += 1
        return n

    return inc


tick = counter()
print(tick())
print(tick())
