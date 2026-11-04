// BUG: scanf needs the ADDRESS of age (&age). Passing age itself crashes.
#include <stdio.h>

int main(void) {
    int age;
    printf("Enter your age: ");
    scanf("%d", age);   /* missing & */
    printf("You are %d years old.\n", age);
    return 0;
}
