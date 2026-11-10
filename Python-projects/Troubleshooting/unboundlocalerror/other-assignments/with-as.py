# BUG: 'as f' assigns f, so f is local to read() and the print above reads it too early.
f = None


def read():
    print(f)               # reads f ...
    with open(__file__) as f:   # ... but 'as f' assigns it
        return f.readline()


read()
