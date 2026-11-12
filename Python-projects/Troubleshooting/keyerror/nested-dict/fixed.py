order = {"id": 7, "customer": {"name": "Li"}}

city = order.get("customer", {}).get("address", {}).get("city", "unknown")
print(city)
