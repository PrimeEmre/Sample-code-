# BUG: n += 1 assigns to n, so inc() treats n as its own local variable, not the one in counter().
def counter():
    n = 0

    def inc():
        n += 1
        return n

    return inc


tick = counter()
print(tick())
