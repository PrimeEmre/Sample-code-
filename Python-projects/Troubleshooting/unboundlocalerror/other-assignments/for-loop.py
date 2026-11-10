# BUG: the for loop assigns i, so i is local to show() and the print above reads it too early.
i = 10


def show():
    print(i)               # reads i ...
    for i in range(3):     # ... but this loop assigns i, so it is local
        pass


show()
