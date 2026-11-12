from pathlib import Path

name = "scores.txt"
if not Path(name).exists():
    print(name, "not found. Files here:", sorted(p.name for p in Path(".").iterdir() if p.suffix == ".txt"))
else:
    print(Path(name).read_text())
