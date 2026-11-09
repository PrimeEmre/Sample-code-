# Diagnose: AttributeError: module 'serial' has no attribute 'Serial'
import importlib.metadata as md

import serial


def installed(name):
    try:
        return md.version(name)
    except md.PackageNotFoundError:
        return None


print("serial.__file__  :", serial.__file__)
print("has serial.Serial:", hasattr(serial, "Serial"))
print("installed pyserial:", installed("pyserial") or "no")
print("installed serial  :", installed("serial") or "no")

if serial.__file__ is None:
    print("-> 'serial' is an empty folder or a damaged install. Fix: pip install --force-reinstall pyserial")
elif hasattr(serial, "Serial"):
    print("-> PySerial looks fine.")
elif installed("serial"):
    print("-> The wrong package is installed ('serial', not 'pyserial'). Fix: pip uninstall serial, then pip install pyserial")
else:
    print("-> A file or folder named 'serial' in your project is hiding PySerial (see the path above). Rename it.")
