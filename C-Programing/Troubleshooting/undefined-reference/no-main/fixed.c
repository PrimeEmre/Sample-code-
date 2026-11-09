// FIX: add main(), the function every C program starts in.
#include <stdio.h>

void greet(void) {
    printf("Hello\n");
}

int main(void) {
    greet();
    return 0;
}
