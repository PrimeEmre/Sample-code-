# Task Manager CLI (C)

A small command-line to-do list written in C. Tasks are saved to `tasks.txt` in the current directory.

## Files
- `main.c`: command-line parsing and the add / list / done / delete commands
- `tasks.h`, `tasks.c`: the task list (growable array, load/save, add/remove)

## Build
```
gcc -g -Wall -Wextra main.c tasks.c -o tasks.exe
```

## Use
```
tasks.exe add "buy milk"
tasks.exe list
tasks.exe done 1
tasks.exe delete 1
```

## File format
One task per line: `<0|1>|<text>` (1 = done).
