# FIX: copy what you need out of the exception before the block ends.
def run():
    message = None
    try:
        1 / 0
    except ZeroDivisionError as err:
        message = str(err)     # copy what you need before the block ends
    print(message)


run()
