# Python: FileNotFoundError: [Errno 2] No such file or directory

Each subfolder has a `bug.py` that raises the error and a `fixed.py` with the fix. Tested on Python 3.11, 3.12 and 3.14 (Windows). Run `bug.py` and `fixed.py` from inside their folder, **except** `wrong-working-directory`, which fails only when you run it from a different folder: from this `filenotfounderror` folder run `python wrong-working-directory/bug.py` and then `python wrong-working-directory/fixed.py`.

| Folder | Cause | Fix |
|---|---|---|
| [`wrong-working-directory`](./wrong-working-directory/) | A relative path is resolved from where you run Python, not where the script is | `Path(__file__).parent / "data.txt"` |
| [`typo-filename`](./typo-filename/) | `scores.txt` vs `score.txt` | Check `Path.exists()` and list the folder |
| [`double-extension`](./double-extension/) | Windows hides the extension: the file is `notes.txt.txt` | Show file extensions, use the real name |
| [`missing-folder-on-write`](./missing-folder-on-write/) | `open("output/x.txt", "w")` does not create `output` | `Path("output").mkdir(exist_ok=True)` |
| [`tilde-not-expanded`](./tilde-not-expanded/) | `open("~/x.txt")` treats `~` as a folder name | `Path("~/x.txt").expanduser()` |
| [`read-before-create`](./read-before-create/) | `"r"` never creates a file | Create it first, or open with `"a"` |

Blog post: [FileNotFoundError: [Errno 2] No such file or directory (Fix)](https://blog.emreguzel.ca/2026/11/12/filenotfounderror-errno-2-no-such-file-or-directory-fix/)
