# Python: KeyError

Each subfolder has a `bug.py` that raises the error and a `fixed.py` with the fix. Run any file with `python bug.py` from inside its folder. Tested on Python 3.11, 3.12 and 3.14.

| Folder | Cause | Fix |
|---|---|---|
| [`missing-key`](./missing-key/) | The key is not in the dictionary | `d.get(key, default)` or `key in d` |
| [`typo-or-case`](./typo-or-case/) | `"name"` vs `"Name"` | Use the exact key, or lower-case the keys |
| [`int-vs-str-key`](./int-vs-str-key/) | JSON keys are strings, so `data[1]` fails | Use `"1"`, or convert the keys |
| [`pop-and-del`](./pop-and-del/) | `pop` or `del` of a missing key | `pop(key, None)`, or test first |
| [`nested-dict`](./nested-dict/) | A key is missing deep in nested data | Chain `get(key, {})` |
| [`csv-header-space`](./csv-header-space/) | `name, age` gives the key `" age"` | `skipinitialspace=True` |

Blog post: [KeyError in Python: Causes and Fixes](https://blog.emreguzel.ca/2026/11/12/keyerror-in-python-causes-and-fixes/)
