// BUG: a struct definition must end with a semicolon after the closing brace.
#include <stdio.h>

struct Point {
    int x;
    int y;
}

int main(void) {
    struct Point p = {1, 2};
    printf("%d\n", p.x);
    return 0;
}
