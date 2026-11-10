# BUG: count = count + 1 assigns to count, so Python treats count as a local variable in add().
# The right-hand side then reads that local before it has a value.
count = 0


def add():
    count = count + 1
    return count


print(add())
