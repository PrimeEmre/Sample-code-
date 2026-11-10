# BUG: total += n is total = total + n, which assigns to total, so total is local in add().
total = 0


def add(n):
    total += n
    return total


print(add(5))
