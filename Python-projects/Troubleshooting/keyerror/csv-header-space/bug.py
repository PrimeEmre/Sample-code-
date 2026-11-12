import csv
import io

text = "name, age\nAna, 31\n"          # note the space after the comma
for row in csv.DictReader(io.StringIO(text)):
    print(row["age"])                  # KeyError: 'age'  (the key is " age")
