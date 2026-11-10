// BUG: no semicolon after int x = 5. GCC reports the error on the NEXT line, where it finally gives up.
#include <stdio.h>

int main(void) {
    int x = 5
    printf("%d\n", x);
    return 0;
}
