# BUG: last is only assigned inside the loop. An empty list never runs the loop.
def last_item(items):
    for item in items:
        last = item
    return last


print(last_item([1, 2, 3]))
print(last_item([]))
