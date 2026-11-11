def min_max(values):
    if values:
        return min(values), max(values)
    # an empty list falls off the end and returns None


low, high = min_max([])                # TypeError: cannot unpack non-iterable NoneType object
print(low, high)
