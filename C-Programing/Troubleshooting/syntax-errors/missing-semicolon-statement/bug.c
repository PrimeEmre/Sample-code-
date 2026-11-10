// BUG: no semicolon after printf(...). GCC points at the end of the line that is missing it.
#include <stdio.h>

int main(void) {
    printf("hi\n")
    return 0;
}
