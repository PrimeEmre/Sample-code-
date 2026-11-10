// BUG: the closing parenthesis of the if condition is missing.
#include <stdio.h>

int main(void) {
    int x = 5;
    if (x > 3 {
        printf("big\n");
    }
    return 0;
}
