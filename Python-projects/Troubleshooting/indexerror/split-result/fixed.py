# FIX: take what is always there, and give the optional part a default.
line = "Ana 17"
name, age, *rest = line.split()
city = rest[0] if rest else "unknown"
print(name, age, city)
