// FIX: put & before int variables. Arrays like name already act as addresses.
#include <stdio.h>

int main(void) {
    int age;
    char name[50];

    printf("Enter your name: ");
    scanf("%49s", name);   /* no & for arrays */
    printf("Enter your age: ");
    scanf("%d", &age);     /* & for int */
    printf("Hello, %s! You are %d years old.\n", name, age);
    return 0;
}
