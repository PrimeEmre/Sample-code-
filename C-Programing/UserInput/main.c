// user input

// #include <stdio.h> // keep this line active - every program below needs it

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

// #include <stdio.h>

// int main (void) {

//     int age;
//     printf("Please enter your age: ");
//     scanf("%d", &age);  
//     if (age >= 18){
//         printf("You are eligible to vote\n");
//     } else {
//         printf("You are not eligible to vote\n");
//     }   

//     return 0;
// }

// foumla = BMI = weight (kg) / height^2 (m^2)

// int main (void){

//     float weight;
//     float height;

//     printf("Please enter your weight in kg: ");
//     scanf("%f", &weight);
    
//     printf("Please enter your height in cm: ");
//     scanf("%f", &height);
//     height = height / 100;

//     float bmi = weight / (height * height);
//     printf("Your BMI is %.1f\n", bmi);

//     if (bmi < 16) {
//         printf("You are in Severe Thinness class\n");
//     } else if (bmi < 17) {
//         printf("You are in Moderate Thinness class\n");
//     } else if (bmi < 18.5) {
//         printf("You are in Mild Thinness class\n");
//     } else if (bmi < 25) {
//         printf("You are in Normal class\n");
//     } else if (bmi < 30) {
//         printf("You are in Overweight class\n");
//     } else if (bmi < 35) {
//         printf("You are in Obese class 1\n");
//     } else if (bmi < 40) {
//         printf("You are in Obese class 2\n");
//     } else {
//         printf("You are in Obese class 3\n");
//     }
//     return 0;
// }

// // Discount calculator

// int main(void) {
//     float price, discount, discounted_price;

//     printf("Enter the original price: ");
//     scanf("%f", &price);

//     printf("Enter the discount percentage: ");
//     scanf("%f", &discount);

//     discounted_price = price - (price * (discount / 100));

//     if (discounted_price < 0) {
//         printf("Error: Discounted price cannot be negative.\n");
//     } else {
//         printf("The discounted price is: %.2f\n", discounted_price);
//     }
//     printf("discounted price is: %.2f\n", discounted_price);
//     return 0;
// }


// Math Quiz program

// #include <stdio.h>
// #include <string.h>
// int main (){
// const char *questions[] = {
//     "What is 5 + 3?",
//     "What is 10 - 4?",
//     "What is 6 * 7?",
//     "What is 20 / 5?",
//     "What is 15 -4?",
//     "What is 8 + 2?",
//     "What is 12 * 3?",
//     "what is 100 / 25?",
//     "What is 9 + 2?",
//     "What is 20 - 16?",
//     "What is 5 * 7?",
//     "What is 18 / 3?"
// };
// const char *answers[] = {
//     "8",
//     "6",
//     "42",
//     "4",
//     "11",
//     "10",
//     "36",
//     "4",
//     "11",
//     "4",
//     "35",
//     "6"
// };
// char user_answer[10];
// int score = 0;
// int total = sizeof(questions) / sizeof(questions[0]);

// for (int i = 0; i < total; i++) {
//     printf("%s ", questions[i]);
//     scanf("%9s", user_answer); 
//     if (strcmp(user_answer, answers[i]) == 0) {
//         printf("Correct!\n");
//         score++;
//     } else {
//         printf("Wrong! The answer is %s\n", answers[i]);
//     }
// }
// printf("Your score is: %d out of %d (%d%%)\n", score, total, score * 100 / total);

// return 0;
// }

// Count from 1 to 10
int main(void) {
    int number = 0;
    for (int i = 1; i <= 10; i++) {
        number += 1;
        printf("%d\n", number);
        scnaf("%d", &number);
    }
}