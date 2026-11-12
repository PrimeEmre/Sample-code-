# Run this from the folder ABOVE this one:  python wrong-working-directory/bug.py
with open("data.txt") as f:            # relative to where you RUN python, not where the script is
    print(f.read())
