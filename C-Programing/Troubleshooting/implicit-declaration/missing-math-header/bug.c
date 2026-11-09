// BUG: sqrt needs <math.h>.
#include <stdio.h>

int main(void) {
    printf("%.1f\n", sqrt(16.0));
    return 0;
}
