# FIX (works, but use sparingly): declare count as global inside the function.
count = 0


def add():
    global count
    count = count + 1
    return count


print(add())
