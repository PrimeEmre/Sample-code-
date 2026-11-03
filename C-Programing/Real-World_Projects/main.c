// Task manager CLI. 

#include <stdio.h>
#include <stdlib.h>
#include "tasks.h"

int main(void) {
    TaskList list;
    tasklist_init(&list);

    if (tasklist_load(&list, "tasks.txt") != 0) {
        fprintf(stderr, "Failed to load tasks.\n");
        return 1;
    }

    if (tasklist_add(&list, "Finish the project") != 0) {
        fprintf(stderr, "Failed to add task.\n");
        tasklist_free(&list);
        return 1;
    }

    if (tasklist_save(&list, "tasks.txt") != 0) {
        fprintf(stderr, "Failed to save tasks.\n");
        tasklist_free(&list);
        return 1;
    }

    tasklist_free(&list);
    return 0;
}   