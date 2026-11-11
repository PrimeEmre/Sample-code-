# Python: IndentationError and TabError

Each subfolder has a `bug.py` that raises the error and a `fixed.py` with the fix. Run any file with `python bug.py` from inside its folder. Tested on Python 3.11, 3.12 and 3.14. The `bug.py` files fail at compile time, before any line runs. In `tab-error/bug.py` the last line of the function is indented with a real tab character.

| Folder | Message | Fix |
|---|---|---|
| [`expected-indented-block`](./expected-indented-block/) | `expected an indented block after 'if' statement` | Indent the body |
| [`unexpected-indent`](./unexpected-indent/) | `unexpected indent` | Remove the extra indentation |
| [`unindent-does-not-match`](./unindent-does-not-match/) | `unindent does not match any outer indentation level` | Same indentation for the whole block |
| [`tab-error`](./tab-error/) | `TabError: inconsistent use of tabs and spaces in indentation` | Use spaces only |
| [`empty-function-body`](./empty-function-body/) | A comment-only function body, error shown on the next line | Add `pass` |
| [`else-and-try-blocks`](./else-and-try-blocks/) | `expected an indented block after 'except' statement` | Indent the `except` body |

Blog post: [IndentationError: Expected an Indented Block (Fix)](https://blog.emreguzel.ca/2026/11/11/indentationerror-expected-an-indented-block-fix/)
