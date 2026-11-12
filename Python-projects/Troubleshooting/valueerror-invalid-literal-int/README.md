# Python: ValueError: invalid literal for int() with base 10

Each subfolder has a `bug.py` that raises the error and a `fixed.py` with the fix. Run any file with `python bug.py` from inside its folder. Tested on Python 3.11, 3.12 and 3.14.

| Folder | Text that failed | Fix |
|---|---|---|
| [`empty-string`](./empty-string/) | `''` | Catch the error, or check first |
| [`float-string`](./float-string/) | `'3.50'` | `int(float(text))`, or `Decimal` for money |
| [`thousands-comma`](./thousands-comma/) | `'1,250,000'` | `replace(",", "")` |
| [`unit-suffix`](./unit-suffix/) | `'72kg'` | Extract the digits with `re.search` |
| [`hex-needs-base`](./hex-needs-base/) | `'ff'` | `int(text, 16)` |
| [`header-line-in-file`](./header-line-in-file/) | `'id'` | Skip the header line |

Blog post: [ValueError: invalid literal for int() with base 10 (Fix)](https://blog.emreguzel.ca/2026/11/12/valueerror-invalid-literal-for-int-with-base-10-fix/)
