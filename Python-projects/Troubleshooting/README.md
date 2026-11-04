# Python troubleshooting examples

Code from the "Problems & Solutions" posts on the blog. `bug.py` reproduces the problem and `fixed.py` is the corrected version. Every program is standalone and uses only the standard library.

| Folder | Problem | Blog post |
|---|---|---|
| [`tkinter-freeze`](./tkinter-freeze/) | Tkinter window freezes ("Not Responding") during a slow task | [Read](https://blog.emreguzel.ca/2026/10/11/tkinter-app-freezes-not-responding-fix/) |

## Run

```
python bug.py
python fixed.py
```

Click **Start** in each window. In `bug.py` the window locks up for 3 seconds and "Loading..." never appears. In `fixed.py` the window stays responsive and shows "Done!" when the work finishes.
