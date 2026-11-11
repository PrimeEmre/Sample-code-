# FIX: loop over the items themselves. No index, so no off-by-one.
scores = [90, 80, 70]
for score in scores:
    print(score)

# If you need the position as well, use enumerate:
for i, score in enumerate(scores):
    print(i, score)
