# BUG: Python deletes err when the except block ends, so err is unbound afterwards.
def run():
    try:
        1 / 0
    except ZeroDivisionError as err:
        pass
    print(err)             # Python deletes err when the except block ends


run()
