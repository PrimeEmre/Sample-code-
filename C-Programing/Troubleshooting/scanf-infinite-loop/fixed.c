// FIX: check scanf's return value and throw away the bad input before retrying.
#include <stdio.h>

int main(void) {
    int age;
    printf("Enter your age: ");

    while (scanf("%d", &age) != 1) {
        int c;
        while ((c = getchar()) != '\n' && c != EOF) {
            /* throw away the bad input */
        }
        if (c == EOF) {
            return 1;  /* input closed, nothing more to read */
        }
        printf("That's not a number. Try again: ");
    }

    printf("You are %d years old.\n", age);
    return 0;
}
