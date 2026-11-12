class User:
    @property
    def name(self):
        return self.name               # asks the property again, forever

    def __init__(self, name):
        self._name = name


print(User("Ana").name)                # RecursionError
