// FIX: include <math.h>. On Linux you usually also link with -lm.
#include <math.h>
#include <stdio.h>

int main(void) {
    printf("%.1f\n", sqrt(16.0));
    return 0;
}
