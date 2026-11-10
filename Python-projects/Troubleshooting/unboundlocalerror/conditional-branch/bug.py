# BUG: result is only assigned inside the if. When score < 50 it is never assigned.
def describe(score):
    if score >= 50:
        result = "pass"
    return result


print(describe(80))
print(describe(10))
