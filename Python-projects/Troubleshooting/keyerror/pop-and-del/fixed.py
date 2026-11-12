cart = {"milk": 2}

cart.pop("bread", None)                # pop with a default never raises
print(cart)

if "bread" in cart:
    del cart["bread"]                  # del has no default, so test first
