// BUG: main() is never closed, so GCC reaches the end of the file still waiting for a }.
#include <stdio.h>

int main(void) {
    printf("hi\n");
    return 0;
