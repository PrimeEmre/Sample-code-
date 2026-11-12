from pathlib import Path

here = Path(__file__).parent           # the folder this script lives in
with open(here / "data.txt") as f:
    print(f.read())
