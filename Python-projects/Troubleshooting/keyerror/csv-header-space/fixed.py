import csv
import io

text = "name, age\nAna, 31\n"
for row in csv.DictReader(io.StringIO(text), skipinitialspace=True):
    print(row["age"])
