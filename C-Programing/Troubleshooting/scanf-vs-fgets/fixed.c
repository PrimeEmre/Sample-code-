// FIX: read the whole line with fgets, then parse numbers with sscanf.
#include <stdio.h>
#include <string.h>

int main(void) {
    char full[50];
    char line[100];
    int age;

    printf("Full name: ");
    if (fgets(full, sizeof full, stdin) == NULL) {
        return 1;
    }
    full[strcspn(full, "\n")] = '\0';   /* strip the newline */
    printf("%s\n", full);               /* prints "Emre Guzel" */

    printf("Age: ");
    if (fgets(line, sizeof line, stdin) == NULL) {
        return 1;                       /* EOF or read error */
    }
    if (sscanf(line, "%d", &age) != 1) {
        printf("That is not a number.\n");
        return 1;
    }
    printf("You are %d\n", age);
    return 0;
}
