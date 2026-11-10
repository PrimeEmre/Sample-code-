# Python: UnboundLocalError (local variable referenced before assignment)

Each subfolder has a `bug.py` that raises the error and a `fixed.py` with the fix. Run any file with `python bug.py` from inside its folder. Tested on Python 3.11, 3.12 and 3.14.

| Folder | Cause | Fix |
|---|---|---|
| [`global-assign`](./global-assign/) | `count = count + 1` inside a function makes `count` local | Pass the value in and return the result (`fixed.py`), or `global count` (`fixed_global.py`) |
| [`augmented-assign`](./augmented-assign/) | `total += n` assigns to `total` | Pass the total in and return the new total |
| [`conditional-branch`](./conditional-branch/) | The variable is only assigned inside an `if` | Assign on every path |
| [`assigned-later`](./assigned-later/) | A variable is used above the line that assigns it | Assign before use |
| [`empty-loop`](./empty-loop/) | The variable is only assigned inside a loop that may not run | Set a starting value before the loop |
| [`nested-function`](./nested-function/) | An inner function assigns to an outer function's variable | `nonlocal n` |
| [`other-assignments`](./other-assignments/) | `import`, a `for` variable, `with ... as` and `except ... as` also make a name local | Move the import up, rename the variable, or copy what you need out of the `except` block (`except-fixed.py`) |

Blog post: [UnboundLocalError: Local Variable Referenced Before Assignment](https://blog.emreguzel.ca/2026/11/10/unboundlocalerror-variable-referenced-before-assignment/)
