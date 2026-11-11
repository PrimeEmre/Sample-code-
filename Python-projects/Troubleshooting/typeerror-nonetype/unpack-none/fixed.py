def min_max(values):
    if not values:
        return None, None              # always return the same shape
    return min(values), max(values)


low, high = min_max([])
print(low, high)
