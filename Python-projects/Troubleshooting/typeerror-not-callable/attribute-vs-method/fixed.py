class Cart:
    def __init__(self):
        self.items = 0                 # data gets one name

    def count(self):                   # the method gets another
        return self.items


cart = Cart()
print(cart.count())
