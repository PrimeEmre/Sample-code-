# FIX: pass the running total in and return the new total.
total = 0


def add(total, n):
    return total + n


total = add(total, 5)
print(total)
