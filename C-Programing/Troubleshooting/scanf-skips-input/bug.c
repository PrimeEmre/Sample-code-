// BUG: the Enter after the age stays in the buffer, and %c reads it as the grade.
#include <stdio.h>

int main(void) {
    int age;
    char grade;

    printf("Your age: ");
    scanf("%d", &age);

    printf("Your grade: ");
    scanf("%c", &grade);    // never waits!

    printf("Age %d, grade %c\n", age, grade);
    return 0;
}
