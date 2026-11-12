user = {"Name": "Ana", "email": "ana@example.com"}

print(user["Name"])                    # use the exact key

# if the case is unreliable, normalise the keys once:
clean = {k.lower(): v for k, v in user.items()}
print(clean["name"])
