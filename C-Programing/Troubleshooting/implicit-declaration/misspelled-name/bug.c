// BUG: prinft is a typo, so the compiler treats it as a function it has never seen.
#include <stdio.h>

int main(void) {
    prinft("Hello\n");
    return 0;
}
