# FIX: give result a value on every path.
def describe(score):
    if score >= 50:
        result = "pass"
    else:
        result = "fail"
    return result


print(describe(80))
print(describe(10))
