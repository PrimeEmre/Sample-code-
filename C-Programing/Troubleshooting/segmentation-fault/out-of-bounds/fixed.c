// FIX: stop at the array size. sizeof nums / sizeof nums[0] always matches the declaration.
#include <stdio.h>

int main(void) {
    int nums[3] = {1, 2, 3};
    size_t count = sizeof nums / sizeof nums[0];
    for (size_t i = 0; i < count; i++) {
        nums[i] = (int)i;
    }
    printf("%d\n", nums[0]);
    return 0;
}
