users = {"ana": {"city": "Toronto"}}

profile = users.get("ben")             # no such key, so .get() returns None
print(profile["city"])                 # TypeError: 'NoneType' object is not subscriptable
