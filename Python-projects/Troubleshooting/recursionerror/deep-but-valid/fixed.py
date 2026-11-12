def total(n):
    result = 0
    for i in range(1, n + 1):          # a loop uses no call stack
        result += i
    return result


print(total(5000))
print(sum(range(1, 5001)))             # or use the built-in
