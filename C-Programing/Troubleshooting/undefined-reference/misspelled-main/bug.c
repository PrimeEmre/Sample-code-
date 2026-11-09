// BUG: C is case-sensitive. Main is not main, so there is still no entry point.
#include <stdio.h>

int Main(void) {
    printf("Hello\n");
    return 0;
}
