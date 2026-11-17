# Python: TypeError: 'int' object is not callable

Each subfolder has a `bug.py` that raises the error and a `fixed.py` with the fix. Run any file with `python bug.py` from inside its folder. Tested on Python 3.11, 3.12 and 3.14. The same error appears for other types, for example `'str' object is not callable` or `'list' object is not callable`.

| Folder | Cause | Fix |
|---|---|---|
| [`shadowed-builtin`](./shadowed-builtin/) | `sum = 0` hides the built-in `sum()` | Use a different variable name |
| [`reused-function-name`](./reused-function-name/) | `score = score(3, 4)` replaces the function with its result | Store the result under another name |
| [`missing-operator`](./missing-operator/) | `2 (a + b)` is a call on the number 2 | Add the missing `*` |
| [`attribute-vs-method`](./attribute-vs-method/) | `self.count` and `def count` share a name | Give data and method different names |
| [`calling-a-result`](./calling-a-result/) | `total()()` calls the returned number | Use one pair of parentheses |
| [`loop-variable-hides-function`](./loop-variable-hides-function/) | `for len in range(3)` hides `len()` | Use `i` or another normal name |

Blog post: [TypeError: 'int' Object Is Not Callable (Fix)](https://blog.emreguzel.ca/2026/11/17/typeerror-int-object-is-not-callable-fix/)
