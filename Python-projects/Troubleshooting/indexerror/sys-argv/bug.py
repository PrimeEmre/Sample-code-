# BUG: run with no argument (python bug.py), sys.argv has only the script name, so sys.argv[1] does not exist.
import sys

filename = sys.argv[1]
print("opening", filename)
