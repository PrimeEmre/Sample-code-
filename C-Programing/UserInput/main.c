// calculating the area of cicumfrence of circle 
// formula is A = π * r^2

#define _USE_MATH_DEFINES // needed for M_PI with MSVC (cl.exe)
#include <math.h>
#include <stdio.h>

int main() {
 int  radius ;
 printf("Enter the radius of the circle: ");
    scanf("%d", &radius);

   double area = M_PI * radius * radius;
    printf("The area of the circle is %.2f cm^2\n", area);
    return 0;
}
