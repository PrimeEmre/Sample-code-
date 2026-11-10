# C Troubleshooting examples

Each folder holds the code from one "Problems & Solutions" post on the blog: `bug.c` reproduces the problem and `fixed.c` is the corrected version. Every program is standalone.

| Folder | Problem | Blog post |
|---|---|---|
| [`garbage-value`](./garbage-value/) | Variable printed before it has a value | [Read](https://blog.emreguzel.ca/2026/10/27/c-program-prints-garbage-value/) |
| [`missing-ampersand`](./missing-ampersand/) | `scanf("%d", age)` crashes: missing `&` | [Read](https://blog.emreguzel.ca/2026/10/15/why-your-c-program-crashes-when-you-forget-in-scanf-and-how-to-fix-it/) |
| [`scanf-skips-input`](./scanf-skips-input/) | The second `scanf` never waits for input | [Read](https://blog.emreguzel.ca/2026/10/13/c-scanf-skips-input/) |
| [`scanf-infinite-loop`](./scanf-infinite-loop/) | Typing a letter makes the loop run forever | [Read](https://blog.emreguzel.ca/2026/10/11/c-scanf-infinite-loop-fix/) |
| [`scanf-vs-fgets`](./scanf-vs-fgets/) | `scanf("%s")` stops at the first space | [Read](https://blog.emreguzel.ca/2026/10/27/scanf-vs-fgets-in-c/) |
| [`segmentation-fault`](./segmentation-fault/) | Segmentation fault: NULL pointer, out-of-bounds array, string literal write, infinite recursion (one subfolder each) | [Read](https://blog.emreguzel.ca/2026/11/04/segmentation-fault-in-c-find-the-exact-line/) |
| [`syntax-errors`](./syntax-errors/) | `expected ';' before ...`: missing semicolon, parenthesis, brace, curly quotes, struct semicolon, unterminated string | [Read](https://blog.emreguzel.ca/2026/11/10/c-syntax-error-expected-before-return-fix/) |
| [`implicit-declaration`](./implicit-declaration/) | `implicit declaration of function`: missing include, function order, typo, missing `<math.h>` (one subfolder each) | [Read](https://blog.emreguzel.ca/2026/11/05/c-error-implicit-declaration-of-function-fix/) |
| [`undefined-reference`](./undefined-reference/) | `undefined reference to WinMain`, `multiple definition of main`, and link errors from compiling one file of a project | [Read](https://blog.emreguzel.ca/2026/11/05/gcc-undefined-reference-to-winmain-fix-on-windows/) |

## Build and run

```
gcc -Wall -Wextra -std=c11 bug.c -o bug.exe
gcc -Wall -Wextra -std=c11 fixed.c -o fixed.exe
```

> **Compile one file at a time.** Each folder holds a `bug.c` and a `fixed.c` that both define `main`. The build task in this repo's `.vscode/tasks.json` compiles every `.c` file in the folder (`gcc *.c`), so it fails here with *multiple definition of `main`*. Use `gcc bug.c -o bug.exe` and `gcc fixed.c -o fixed.exe` instead. The `bug.c` files in `implicit-declaration` and `undefined-reference` are meant to fail at build time.

Run from the folder with `.ug.exe` in PowerShell. The `bug` programs are meant to misbehave: `garbage-value` prints a random number, `missing-ampersand` crashes, and `scanf-infinite-loop` never stops when you type a letter (press Ctrl+C).
