// FIX: the space in " %c" skips leftover whitespace (including the newline).
#include <stdio.h>

int main(void) {
    int age;
    char grade;

    printf("Your age: ");
    scanf("%d", &age);

    printf("Your grade: ");
    scanf(" %c", &grade);   // note the space

    printf("Age %d, grade %c\n", age, grade);
    return 0;
}
