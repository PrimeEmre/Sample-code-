class Node:
    def __init__(self, label):
        self.label = label
        self.other = None

    def __repr__(self):
        return f"Node({self.label}, {self.other!r})"


a, b = Node("a"), Node("b")
a.other, b.other = b, a                # a points to b, b points back to a
print(repr(a))                         # RecursionError while getting the repr of an object
