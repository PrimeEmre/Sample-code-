def tax(price):
    print(price * 0.13)                # prints, but returns None


total = 100 + tax(100)                 # TypeError: unsupported operand type(s) for +: 'int' and 'NoneType'
