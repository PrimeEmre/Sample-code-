# Python: RecursionError: maximum recursion depth exceeded

Each subfolder has a `bug.py` that raises the error and a `fixed.py` with the fix. Run any file with `python bug.py` from inside its folder. Tested on Python 3.11, 3.12 and 3.14. The default limit is 1000 nested calls (`sys.getrecursionlimit()`). The exact wording after "exceeded" differs slightly between versions.

| Folder | Cause | Fix |
|---|---|---|
| [`missing-base-case`](./missing-base-case/) | The function calls itself and never stops | Add a base case that returns |
| [`base-case-never-reached`](./base-case-never-reached/) | `n == 0` is never reached from a negative `n` | Use `<=` and validate the input |
| [`property-setter`](./property-setter/) | `return self.name` inside the `name` property | Store the data as `self._name` |
| [`repr-calls-itself`](./repr-calls-itself/) | Two objects that point at each other print each other forever | Print a label, not the whole object |
| [`mutual-recursion`](./mutual-recursion/) | Two functions call each other and never reach the base case | Remove the recursion, or fix the base case |
| [`deep-but-valid`](./deep-but-valid/) | A correct recursive sum that needs 5000 nested calls | Use a loop or a built-in |

Blog post: [RecursionError: Maximum Recursion Depth Exceeded (Fix)](https://blog.emreguzel.ca/2026/11/12/recursionerror-maximum-recursion-depth-exceeded-fix/)
