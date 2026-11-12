from pathlib import Path

target = Path("~/notes_demo.txt").expanduser()   # turn "~" into your real home folder
target.write_text("hi")
print("wrote", target)
target.unlink()                                  # clean up the demo file
