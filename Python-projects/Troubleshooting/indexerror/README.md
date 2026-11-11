# Python: IndexError: list index out of range

Each subfolder has a `bug.py` that raises the error and a `fixed.py` with the fix. Run any file with `python bug.py` from inside its folder (`sys-argv` runs without an argument on purpose; give `fixed.py` a file name to see it work). Tested on Python 3.11, 3.12 and 3.14.

| Folder | Cause | Fix |
|---|---|---|
| [`off-by-one`](./off-by-one/) | `names[len(names)]`: the last index is `len - 1` | `names[-1]` or `names[len(names) - 1]` |
| [`range-plus-one`](./range-plus-one/) | `range(len(x) + 1)` goes one step too far | Loop over the items, or use `enumerate` |
| [`empty-list`](./empty-list/) | Taking `results[0]` from an empty list | Check `if results:` first |
| [`sys-argv`](./sys-argv/) | `sys.argv[1]` when no argument was given | Check `len(sys.argv)` and print a usage message |
| [`split-result`](./split-result/) | `split()` gave fewer parts than the code expects | `name, age, *rest = ...` with a default |
| [`remove-while-looping`](./remove-while-looping/) | `pop()` inside `for i in range(len(nums))` | Build a new list |
| [`other-types`](./other-types/) | The messages for tuple, string, `pop` and a dict `KeyError` | Same ideas |

Blog post: [IndexError: List Index Out of Range (Fix)](https://blog.emreguzel.ca/2026/11/11/indexerror-list-index-out-of-range-fix/)
