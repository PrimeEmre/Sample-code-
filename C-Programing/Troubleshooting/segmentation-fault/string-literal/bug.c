// BUG: "emre" is a string literal stored in read-only memory. name points at it, so name[0] = 'E' is a write to read-only memory.
#include <stdio.h>

int main(void) {
    char *name = "emre";
    name[0] = 'E';
    printf("%s\n", name);
    return 0;
}
