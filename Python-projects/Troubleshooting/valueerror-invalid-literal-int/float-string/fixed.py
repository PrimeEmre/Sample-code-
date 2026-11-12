price = "3.50"
cents = int(float(price) * 100)        # parse as float first
print(cents)

from decimal import Decimal            # exact money maths
print(int(Decimal(price) * 100))
