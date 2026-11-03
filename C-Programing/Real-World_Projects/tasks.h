#ifndef TASKS_H
#define TASKS_H

#include <stddef.h>

typedef struct {
    char *text;
    int done;
} Task;

typedef struct {
    Task *items;
    size_t count;
    size_t capacity;
} TaskList;

void tasklist_init(TaskList *list);
void tasklist_free(TaskList *list);

/* Returns 0 on success. A missing file is treated as an empty list. */
int tasklist_load(TaskList *list, const char *path);
int tasklist_save(const TaskList *list, const char *path);

/* Copies text into the list. Returns 0 on success. */
int tasklist_add(TaskList *list, const char *text);

/* Removes the task at index (0-based) and frees its text. Returns 0 on success. */
int tasklist_remove(TaskList *list, size_t index);

#endif
