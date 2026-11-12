import json

data = json.loads('{"1": "one", "2": "two"}')   # JSON object keys are always strings
print(data[1])                                  # KeyError: 1
