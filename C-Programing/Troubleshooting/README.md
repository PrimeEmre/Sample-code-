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

## Build and run

```
gcc -Wall -Wextra -std=c11 bug.c -o bug.exe
gcc -Wall -Wextra -std=c11 fixed.c -o fixed.exe
```

Run from the folder with `.ug.exe` in PowerShell. The `bug` programs are meant to misbehave: `garbage-value` prints a random number, `missing-ampersand` crashes, and `scanf-infinite-loop` never stops when you type a letter (press Ctrl+C).
