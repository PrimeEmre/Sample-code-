// gcc main.c            -> undefined reference to `greet`  (greet.c was never compiled)
// gcc main.c greet.c    -> works
#include "greet.h"

int main(void) {
    greet();
    return 0;
}
