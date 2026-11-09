// FIX: declare the function (a prototype) before it is used.
#include <stdio.h>

int add(int a, int b);

int main(void) {
    printf("%d\n", add(2, 3));
    return 0;
}

int add(int a, int b) {
    return a + b;
}
