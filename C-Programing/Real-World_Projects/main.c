#include "tasks.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define DATA_FILE "tasks.txt"

static void usage(const char *program) {
    fprintf(stderr, "Usage: %s add <text> | list | done <number>\n", program);
}

int main(int argc, char **argv) {
    if (argc < 2) {
        usage(argv[0]);
        return 1;
    }

    TaskList list;
    tasklist_init(&list);
    if (tasklist_load(&list, DATA_FILE) != 0) {
        fprintf(stderr, "Could not read %s\n", DATA_FILE);
        tasklist_free(&list);
        return 1;
    }

    int status = 0;
    if (strcmp(argv[1], "add") == 0 && argc == 3) {
        status = tasklist_add(&list, argv[2]);
        if (status == 0) {
            status = tasklist_save(&list, DATA_FILE);
        }
    } else if (strcmp(argv[1], "list") == 0) {
        for (size_t i = 0; i < list.count; i++) {
            printf("%zu. [%c] %s\n", i + 1, list.items[i].done ? 'x' : ' ', list.items[i].text);
        }
    } else if (strcmp(argv[1], "done") == 0 && argc == 3) {
        char *end;
        long number = strtol(argv[2], &end, 10);
        if (*end != '\0' || number < 1 || (size_t)number > list.count) {
            fprintf(stderr, "No task %s\n", argv[2]);
            status = 1;
        } else {
            list.items[number - 1].done = 1;
            status = tasklist_save(&list, DATA_FILE);
        }
    } else {
        usage(argv[0]);
        status = 1;
    }

    tasklist_free(&list);
    return status == 0 ? 0 : 1;
}