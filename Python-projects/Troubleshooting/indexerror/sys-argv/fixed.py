# FIX: check how many arguments you got, and tell the user what to type.
import sys

if len(sys.argv) < 2:
    sys.exit("usage: python fixed.py FILENAME")
filename = sys.argv[1]
print("opening", filename)
