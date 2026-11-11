users = {"ana": {"city": "Toronto"}}

profile = users.get("ben")
if profile is None:
    print("no such user")
else:
    print(profile["city"])

# or give .get() a default:
print(users.get("ben", {}).get("city", "unknown"))
