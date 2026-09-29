// calculating the area of a rectangle using user input
#include <stdio.h>

int main() {
 int length;
 int width;
 printf("Enter the length of the rectangle: ");
    scanf("%d", &length);
    printf("Enter the width of the rectangle: ");
    scanf("%d", &width);
    int area = length * width;
    printf("\n");
    printf("The area of the rectangle is %d cm^2\n", area);
    return 0;5
}
