// BUG: printf is used without #include <stdio.h>, so the compiler has never seen its declaration.
int main(void) {
    printf("Hello\n");
    return 0;
}
