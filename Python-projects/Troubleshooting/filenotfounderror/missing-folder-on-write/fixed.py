from pathlib import Path

out = Path("output")
out.mkdir(exist_ok=True)                    # create the folder first
(out / "report.txt").write_text("done")
print("wrote", out / "report.txt")
