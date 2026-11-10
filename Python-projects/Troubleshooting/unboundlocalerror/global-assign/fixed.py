# FIX (best): pass the value in and return the new one. No hidden global state.
count = 0


def add(count):
    return count + 1


count = add(count)
print(count)
