// BUG: p is NULL, so *p = 5 writes to address 0, which the program does not own.
#include <stdio.h>

int main(void) {
    int *p = NULL;
    printf("about to write\n");
    fflush(stdout);
    *p = 5;
    printf("never printed\n");
    return 0;
}
