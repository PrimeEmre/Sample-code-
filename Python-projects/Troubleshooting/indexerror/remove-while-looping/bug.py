# BUG: range(len(nums)) is fixed at 6 when the loop starts, but pop() makes the list shorter.
nums = [1, 2, 3, 4, 5, 6]
for i in range(len(nums)):
    if nums[i] % 2 == 0:
        nums.pop(i)
print(nums)
