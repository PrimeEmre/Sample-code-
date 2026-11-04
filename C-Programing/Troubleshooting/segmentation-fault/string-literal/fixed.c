// FIX: copy the text into an array you own. The array is writable.
#include <stdio.h>

int main(void) {
    char name[] = "emre";
    name[0] = 'E';
    printf("%s\n", name);
    return 0;
}
