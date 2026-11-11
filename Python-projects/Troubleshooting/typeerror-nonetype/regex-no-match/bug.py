import re

text = "order: pending"
match = re.search(r"#(\d+)", text)    # the text has no order number, so match is None
print(match[1])                        # TypeError: 'NoneType' object is not subscriptable
