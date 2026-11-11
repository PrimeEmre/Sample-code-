# Python: TypeError 'NoneType' object is not subscriptable

Each subfolder has a `bug.py` that raises the error and a `fixed.py` with the fix. Run any file with `python bug.py` from inside its folder. Tested on Python 3.11, 3.12 and 3.14.

| Folder | Cause | Fix |
|---|---|---|
| [`missing-return`](./missing-return/) | The function computes a value but has no `return` | Return the value |
| [`in-place-methods`](./in-place-methods/) | `names = names.sort()` replaces the list with `None` | Call `sort()` alone, or use `sorted()` |
| [`dict-get-missing`](./dict-get-missing/) | `dict.get()` returns `None` for a missing key | Check for `None`, or pass a default |
| [`regex-no-match`](./regex-no-match/) | `re.search()` found nothing | `if match:` before using it |
| [`unpack-none`](./unpack-none/) | A function returns a tuple on some paths and nothing on others | Return the same shape on every path |
| [`none-not-iterable`](./none-not-iterable/) | A function never returns its list, then a `for` loop runs over `None` | Return the list |
| [`none-arithmetic-and-call`](./none-arithmetic-and-call/) | `print()` used instead of `return`, then `100 + None` | Return the value |

Blog post: [TypeError: 'NoneType' Object Is Not Subscriptable](https://blog.emreguzel.ca/2026/11/11/typeerror-nonetype-object-is-not-subscriptable-fix/)
