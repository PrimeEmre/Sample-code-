# Python troubleshooting examples

Code from the "Problems & Solutions" posts on the blog. `bug.py` reproduces the problem and `fixed.py` is the corrected version. Every program is standalone and uses only the standard library.

| Folder | Problem | Blog post |
|---|---|---|
| [`tkinter-freeze`](./tkinter-freeze/) | Tkinter window freezes ("Not Responding") during a slow task | [Read](https://blog.emreguzel.ca/2026/10/11/tkinter-app-freezes-not-responding-fix/) |
| [`tkinter-image-doesnt-exist`](./tkinter-image-doesnt-exist/) | `TclError: image "pyimage1" doesn't exist`: three causes, plus `Too early to create image` | [Read](https://blog.emreguzel.ca/2026/11/10/tkinter-tclerror-image-doesnt-exist-fix/) |
| [`unboundlocalerror`](./unboundlocalerror/) | `UnboundLocalError`: six causes, from `count = count + 1` to nested functions | [Read](https://blog.emreguzel.ca/2026/11/10/unboundlocalerror-variable-referenced-before-assignment/) |
| [`indexerror`](./indexerror/) | `IndexError: list index out of range`: six causes, plus the tuple, string and `pop` variants | [Read](https://blog.emreguzel.ca/2026/11/11/indexerror-list-index-out-of-range-fix/) |
| [`typeerror-nonetype`](./typeerror-nonetype/) | `TypeError: 'NoneType' object is not subscriptable`: seven causes, from a missing `return` to `sort()` | [Read](https://blog.emreguzel.ca/2026/11/11/typeerror-nonetype-object-is-not-subscriptable-fix/) |
| [`indentationerror`](./indentationerror/) | `IndentationError` and `TabError`: six causes, from a missing indent to mixed tabs | [Read](https://blog.emreguzel.ca/2026/11/11/indentationerror-expected-an-indented-block-fix/) |
| [`keyerror`](./keyerror/) | `KeyError`: six causes, from a missing key to a hidden space in a CSV header | [Read](https://blog.emreguzel.ca/2026/11/12/keyerror-in-python-causes-and-fixes/) |
| [`valueerror-invalid-literal-int`](./valueerror-invalid-literal-int/) | `ValueError: invalid literal for int()`: six inputs that fail, from `''` to `'3.50'` | [Read](https://blog.emreguzel.ca/2026/11/12/valueerror-invalid-literal-for-int-with-base-10-fix/) |
| [`filenotfounderror`](./filenotfounderror/) | `FileNotFoundError: [Errno 2]`: six causes, from the working directory to a hidden `.txt.txt` | [Read](https://blog.emreguzel.ca/2026/11/12/filenotfounderror-errno-2-no-such-file-or-directory-fix/) |
| [`recursionerror`](./recursionerror/) | `RecursionError: maximum recursion depth exceeded`: six causes, from a missing base case to a property that calls itself | [Read](https://blog.emreguzel.ca/2026/11/12/recursionerror-maximum-recursion-depth-exceeded-fix/) |
| [`pyserial-no-attribute-serial`](./pyserial-no-attribute-serial/) | `module 'serial' has no attribute 'Serial'`: a diagnostic script for three causes | [Read](https://blog.emreguzel.ca/2026/11/09/pyserial-module-serial-has-no-attribute-serial/) |

## Run

```
python bug.py
python fixed.py
```

Click **Start** in each window. In `bug.py` the window locks up for 3 seconds and "Loading..." never appears. In `fixed.py` the window stays responsive and shows "Done!" when the work finishes.
