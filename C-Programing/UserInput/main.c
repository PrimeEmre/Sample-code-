// user input 

// calculating the area of circumference of circle 
// formula is A = π * r^2

// #define _USE_MATH_DEFINES // needed for M_PI with MSVC (cl.exe)
// #include <math.h>
// #include <stdio.h>

// int main() {
//  int  radius ;
//  printf("Enter the radius of the circle: ");
//     scanf("%d", &radius);

//    double area = M_PI * radius * radius;
//     printf("The area of the circle is %.2f cm^2\n", area);
//     return 0;
// }

// #include <stdio.h>

// int main() {
//     char name[50];
//     printf("Enter your full name: ");
//     fgets(name, sizeof(name), stdin);
//     printf("Hello, %s", name);
//     return 0;
// }

// #include <stdio.h>

// int main() {
//     int age;
//     int result;
//     int c;

//     printf("Please enter your age: ");
//     while ((result = scanf("%d", &age)) != 1) {
//         if (result == EOF) {
//             return 1;  // no more input, so stop
//         }
//         while ((c = getchar()) != '\n' && c != EOF) {
//             // throw away the rest of the bad line
//         }
//         printf("That's not a number. Please enter your age: ");
//     }
//     printf("You are %d years old.\n", age);
//     return 0;
// }


// logic statments using if and else 

//  #include <stdio.h>

//  int main(void) {
//      int score;

//      printf("Enter your score (0-100): ");
//     if (scanf("%d", &score) != 1 || score < 0 || score > 100) {
//         printf("Please enter a number from 0 to 100.\n");
//          return 1;
//      }

//      if (score >= 100) {
//          printf("Grade: A+\n");
//     } else if (score >= 85) {
//            printf("Grade: A\n");
//        } else if (score >= 80) {
//            printf("Grade: A-\n");
//        } else if (score >= 79) {
//            printf("Grade: B+\n");
//             } else if (score >= 79) {
//            printf("Grade: B+\n");
//        } else if (score >= 75) {
//            printf("Grade: B\n");
//        } else if (score >= 70) {
//            printf("Grade: B-\n");
//        } else if (score >= 69) {
//            printf("Grade: C+\n");
//        } else if (score >= 65) {
//            printf("Grade: C\n");
//        } else if (score >= 60) {
//            printf("Grade: C-\n");
//        } else if (score >= 59) {
//            printf("Grade: D+\n");
//        } else if (score >= 55) {
//            printf("Grade: D\n");
//        } else if (score >= 50) {
//            printf("Grade: D-\n");
//        } else {
//            printf("Grade: F\n");
//        }
//          return 0;
//  }

#include <stdio.h>

int main (void) {

    int age;
    printf("Please enter your age: ");
    scanf("%d", &age);  
    if (age >= 18){
        printf("You are eligible to vote\n");
    } else {
        printf("You are not eligible to vote\n");
    }   

    return 0;
}