class Node:
    def __init__(self, label):
        self.label = label
        self.other = None

    def __repr__(self):
        other = self.other.label if self.other else None   # print the label, not the whole object
        return f"Node({self.label}, other={other})"


a, b = Node("a"), Node("b")
a.other, b.other = b, a
print(repr(a))
