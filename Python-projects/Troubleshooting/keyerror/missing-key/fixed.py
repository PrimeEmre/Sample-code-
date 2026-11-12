prices = {"apple": 1.20, "pear": 0.90}

print(prices.get("banana", "not for sale"))   # default instead of an error

if "banana" in prices:                        # or test first
    print(prices["banana"])
else:
    print("not for sale")
