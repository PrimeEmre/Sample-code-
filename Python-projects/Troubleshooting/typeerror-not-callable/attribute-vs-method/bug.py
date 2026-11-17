class Cart:
    def __init__(self):
        self.count = 0                 # an attribute...

    def count(self):                   # ...and a method with the same name: the attribute wins
        return self.count


cart = Cart()
print(cart.count())                    # TypeError: 'int' object is not callable
