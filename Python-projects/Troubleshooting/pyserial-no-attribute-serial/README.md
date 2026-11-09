# PySerial: module 'serial' has no attribute 'Serial'

`check_pyserial.py` finds out why `import serial` does not give you PySerial. Run it with the same Python you use for your project:

```
python check_pyserial.py
```

It prints where `serial` was loaded from, whether `serial.Serial` exists, which of `pyserial` and `serial` are installed, and what to do next.

| What it says | Cause | Fix |
|---|---|---|
| `serial.__file__` is `None` | Empty folder named `serial`, or a damaged install (`__init__.py` is missing) | `pip install --force-reinstall pyserial` |
| The path points into your own project | A file or folder named `serial` hides the package | Rename it, delete `__pycache__` |
| `installed serial` shows a version | The wrong package (`serial`) was installed | `pip uninstall serial`, then `pip install pyserial` |

Blog post: [PySerial: module 'serial' has no attribute 'Serial'](https://blog.emreguzel.ca/2026/11/09/pyserial-module-serial-has-no-attribute-serial/)
