import re

text = "order: pending"
match = re.search(r"#(\d+)", text)
if match:
    print(match[1])
else:
    print("no order number found")
