class User:
    def __init__(self, name):
        self._name = name              # store the data under a different name

    @property
    def name(self):
        return self._name


print(User("Ana").name)
