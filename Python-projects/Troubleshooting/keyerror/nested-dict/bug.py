order = {"id": 7, "customer": {"name": "Li"}}

print(order["customer"]["address"]["city"])   # KeyError: 'address'
