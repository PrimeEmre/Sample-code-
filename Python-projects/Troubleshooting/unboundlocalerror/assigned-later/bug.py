# BUG: name is assigned further down, so it is local from the very first line of show().
def show():
    print(name)
    name = "Emre"


show()
