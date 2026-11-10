# C syntax errors: expected ';' before ...

Each subfolder has a `bug.c` that GCC refuses to compile and a `fixed.c` that builds and runs. Compile one file at a time:

```
gcc -Wall -Wextra bug.c -o bug.exe
gcc -Wall -Wextra fixed.c -o fixed.exe
```

The `bug.c` files start with a one-line comment, so the line numbers in GCC's messages are one higher than in the blog post.

| Folder | The mistake | GCC says |
|---|---|---|
| [`missing-semicolon-declaration`](./missing-semicolon-declaration/) | No `;` after `int x = 5` | `expected ',' or ';' before 'printf'` (on the next line) |
| [`missing-semicolon-statement`](./missing-semicolon-statement/) | No `;` after `printf(...)` | `expected ';' before 'return'` |
| [`missing-paren`](./missing-paren/) | `if (x > 3 {` | `expected ')' before '{' token` |
| [`missing-brace`](./missing-brace/) | `main` is never closed | `expected declaration or statement at end of input` |
| [`curly-quotes`](./curly-quotes/) | “Curly” quotes around a string | `stray '\342' in program` |
| [`struct-semicolon`](./struct-semicolon/) | No `;` after a struct's `}` | `expected ';', identifier or '(' before 'int'` |
| [`unterminated-string`](./unterminated-string/) | `"hello);` | `missing terminating " character` |

Blog post: [C Syntax Error: Expected ';' Before 'return' (Fix)](https://blog.emreguzel.ca/2026/11/10/c-syntax-error-expected-before-return-fix/)
