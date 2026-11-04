// BUG: total is never given a value, so printf shows whatever was in memory.
#include <stdio.h>

int main(void) {
    int total;
    printf("Total: %d\n", total);
    return 0;
}
