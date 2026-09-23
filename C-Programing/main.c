// Hello world program in C

// #include <stdio.h>

// int main(){
//     printf("Hello, World!\n");
//     return 0;

// Priting our name 

// #include <stdio.h>

// int main(){
//     printf( "Emre Guzel\n");
//     printf("Favorite place in the world?\n");
//     printf("Istanbul\n");
//     return 0;
// }

// About me program

// #include <stdio.h>

// int main(){
//     printf( "Favorite car? \n");
//     printf("Mercedes Maybach S class s 500 \n");
//     printf("\n");
//     printf("Favorite Resturan\n");
//     printf("Nusret\n");
//     printf("\n");
//     printf("Favorite food\n");
//     printf("Adana Kebab \n");
//     return 0;
// }

// Caluclating 

// #include <stdio.h>

// int main(){
//     printf( "1 + 1 = %d\n", 1 + 1 );
//     return 0;
// }

// #include <stdio.h>

// int main(){
//     printf( "100 X 100 = %d\n", 100 * 100 );
//     return 0;
// }

// #include <stdio.h>

// int main(){
//     printf( "500 / 5 = %d\n", 500 / 5 );
//     return 0;
// }

// Creating veriables and printing them

// #include <stdio.h>
// int main(){
//     int num1 = 100;
//     int num2 = 200;
//     printf("100 + 200 is eqaul to : %d\n", num1 + num2);
// }

//Area of rectangle
//a= lw
// int main(){
//     int legnth = 5;
//     int width = 4;
//     int result = legnth * width;
//     printf("Area of the rectangle is: %d %s\n", result, "mm²");
// }

// float veriables
// #include <stdio.h>
// int main(){
//     float num1 = 9.9;
//     float num2 = 10.4;
//     float result = num1 + num2;
//     printf("9.9 + 10.4 is equal to: %.2f\n", result);
//     return 0;
// }

// #include <stdio.h>
// // Circumference of circle 
// //C= 2πr 
// int main(){
//     const float TAU = 6.28; //3.14 * 2 = 6.28
//     float radius = 65.78;
//     float Circumference = radius * TAU;
//     printf("Circumference of the circle is: %.3f\n", Circumference);
//     return 0;
// }

// #include <stdio.h>
// // Area of triangle  
// // A = 1/2 * b * h 
// int main(){
//     float base = 140.3;
//     float height = 9.9;
//     float result =  base * height / 2;
//     printf("Area of the triangle is: %.2f %s\n", result,"m^2");
//     return 0;
// }

// creating string veriables
// #include <stdio.h>
// int main(){
//     char name[] = "Emre Guzel";
//     char favorite_place[] = "Istanbul";
//     printf("My name is: %s\n", name);
//     printf("My favorite place in the world is: %s\n", favorite_place);
//     return 0;
// }

// about me prgram with veribles 
#include <stdio.h>
int main(){
    char name[] = "Emre Guzel";
    char place[] = "Dubai";
    char favoriteRestaurant[] = "Aga Baba";
    char favoriteFood[] = "Roasted lamb";
    char favoriteCar[] = "Mercedes Maybach S class s 500";
    char favoriteCodingLanguage[] = "Python";
    printf("My name is: %s\n", name);
    printf("My favorite place in the world is: %s\n", place);
    printf("My favorite restaurant is: %s\n", favoriteRestaurant);
    printf("My favorite food is: %s\n", favoriteFood);
    printf("My favorite car is: %s\n", favoriteCar);
    printf("My favorite coding language is: %s\n", favoriteCodingLanguage);
    return 0;
}
