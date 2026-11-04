// FIX: give the recursion a base case that stops it.
#include <stdio.h>

int depth(int n) {
    if (n >= 5) {
        return n;
    }
    return depth(n + 1);
}

int main(void) {
    printf("%d\n", depth(0));
    return 0;
}
