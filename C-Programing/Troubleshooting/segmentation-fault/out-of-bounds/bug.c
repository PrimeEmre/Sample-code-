// BUG: the loop runs far past the end of the 3-element array and writes into memory it does not own.
#include <stdio.h>

int main(void) {
    int nums[3] = {1, 2, 3};
    for (int i = 0; i <= 100000; i++) {
        nums[i] = i;
    }
    printf("%d\n", nums[0]);
    return 0;
}
