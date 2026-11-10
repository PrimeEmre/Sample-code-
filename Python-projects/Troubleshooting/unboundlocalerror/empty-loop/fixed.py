# FIX: set a starting value before the loop.
def last_item(items):
    last = None
    for item in items:
        last = item
    return last


print(last_item([1, 2, 3]))
print(last_item([]))
