def total(n):
    if n == 0:
        return 0
    return n + total(n - 1)            # correct, but needs 5000 nested calls


print(total(5000))                     # RecursionError: Python stops at about 1000 calls
