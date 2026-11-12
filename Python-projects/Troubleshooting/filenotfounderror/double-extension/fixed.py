from pathlib import Path

for p in sorted(Path(".").glob("notes*")):     # list what is really there, extension included
    print("found:", p.name)

with open("notes.txt.txt") as f:               # use the real name (or rename the file)
    print(f.read())
