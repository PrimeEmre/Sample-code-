# Tkinter: image "pyimage1" doesn't exist

Each subfolder has a `bug.py` that reproduces the error and a `fixed.py` with the fix. Run them from inside the subfolder, because they load `icon.png` from the current folder:

```
cd two-roots
python bug.py
python fixed.py
```

| Folder | Error | Cause |
|---|---|---|
| [`two-roots`](./two-roots/) | `TclError: image "pyimage1" doesn't exist` | A second `tk.Tk()` window. Use `tk.Toplevel` instead |
| [`destroyed-root`](./destroyed-root/) | `TclError: image "pyimage1" doesn't exist` | The image was created for a root window that was destroyed |
| [`garbage-collected`](./garbage-collected/) | `TclError: image "pyimage1" doesn't exist` | Nothing kept a reference to the `PhotoImage`, so it was deleted |
| [`too-early`](./too-early/) | `RuntimeError: Too early to create image` | The `PhotoImage` was created before any window existed |

Blog post: [Tkinter TclError: Image Doesn't Exist (Fix)](https://blog.emreguzel.ca/2026/11/10/tkinter-tclerror-image-doesnt-exist-fix/)
