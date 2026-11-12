from pathlib import Path

log = Path("log.txt")
if not log.exists():
    log.write_text("")                       # create it first (or open with "a")
with open(log, "a+") as f:
    f.seek(0)
    print(repr(f.read()))
