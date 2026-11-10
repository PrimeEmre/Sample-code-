# BUG: the import further down makes os local to where(), so the print above reads it too early.
import os


def where():
    print(os.getcwd())     # os is read here ...
    import os              # ... but this import makes os local to where()


where()
