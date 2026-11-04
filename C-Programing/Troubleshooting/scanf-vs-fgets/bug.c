// BUG: scanf("%s") stops at the first space, so "Emre Guzel" becomes "Emre".
#include <stdio.h>

int main(void) {
    char first[20];
    printf("Full name: ");
    scanf("%19s", first);
    printf("%s\n", first);      /* prints "Emre" only */
    return 0;
}
