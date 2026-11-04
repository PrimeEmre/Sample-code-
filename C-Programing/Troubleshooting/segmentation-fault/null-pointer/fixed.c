// FIX: get real memory, and check that you got it before you use it.
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *p = malloc(sizeof *p);
    if (p == NULL) {
        fprintf(stderr, "out of memory\n");
        return 1;
    }
    *p = 5;
    printf("value: %d\n", *p);
    free(p);
    return 0;
}
