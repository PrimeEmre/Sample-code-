# The same mistake on other types gives a slightly different message.
def try_it(label, fn):
    try:
        fn()
    except Exception as e:
        print(f"{label:8} {type(e).__name__}: {e}")


try_it("list", lambda: [1, 2][5])
try_it("tuple", lambda: (1, 2)[5])
try_it("string", lambda: "ab"[5])
try_it("pop", lambda: [].pop())
try_it("dict", lambda: {"a": 1}["b"])     # a missing dict key is a KeyError, not an IndexError
