import re

weight = "72kg"
match = re.search(r"\d+", weight)
print(int(match.group()) if match else "no number found")
