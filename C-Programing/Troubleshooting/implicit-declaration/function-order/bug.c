// BUG: add() is called in main() before the compiler has seen it.
#include <stdio.h>

int main(void) {
    printf("%d\n", add(2, 3));
    return 0;
}

int add(int a, int b) {
    return a + b;
}
