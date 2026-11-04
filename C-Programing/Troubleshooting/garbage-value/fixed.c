// FIX: give every variable a value when you declare it.
#include <stdio.h>

int main(void) {
    int total = 0;
    double average = 0.0;
    char grade = '\0';
    char name[20] = "";   // first byte is '\0', so %s prints nothing

    printf("Total: %d\n", total);
    printf("Average: %.1f\n", average);
    printf("Grade: [%c]\n", grade == '\0' ? '-' : grade);
    printf("Name: [%s]\n", name);
    return 0;
}
