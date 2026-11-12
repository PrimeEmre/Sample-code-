import json

data = json.loads('{"1": "one", "2": "two"}')
print(data["1"])                                # use the string key

# or convert the keys once after loading:
numbered = {int(k): v for k, v in data.items()}
print(numbered[1])
