// BUG: if the user types a letter, scanf fails and leaves it in the buffer,
// so the loop reads the same letter forever.
#include <stdio.h>

int main(void) {
    int age = -1;
    while (age < 0) {
        printf("Enter your age: ");
        scanf("%d", &age);
    }
    printf("You are %d years old.\n", age);
    return 0;
}
