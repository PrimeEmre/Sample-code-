#include "tasks.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void tasklist_init(TaskList *list) {
    list->items = NULL;
    list->count = 0;
    list->capacity = 0;
}

void tasklist_free(TaskList *list) {
    for (size_t i = 0; i < list->count; i++) {
        free(list->items[i].text);
    }
    free(list->items);
    tasklist_init(list);
}

int tasklist_add(TaskList *list, const char *text) {
    if (list->count == list->capacity) {
        size_t new_capacity = list->capacity ? list->capacity * 2 : 8;
        Task *grown = realloc(list->items, new_capacity * sizeof(Task));
        if (grown == NULL) {
            return 1;
        }
        list->items = grown;
        list->capacity = new_capacity;
    }

    char *copy = malloc(strlen(text) + 1);
    if (copy == NULL) {
        return 1;
    }
    strcpy(copy, text);

    list->items[list->count].text = copy;
    list->items[list->count].done = 0;
    list->count++;
    return 0;
}

int tasklist_remove(TaskList *list, size_t index) {
    if (index >= list->count) {
        return 1;
    }
    free(list->items[index].text);
    for (size_t i = index; i + 1 < list->count; i++) {
        list->items[i] = list->items[i + 1];
    }
    list->count--;
    return 0;
}

/* File format: one task per line, "<0|1>|<text>". */
int tasklist_load(TaskList *list, const char *path) {
    FILE *file = fopen(path, "r");
    if (file == NULL) {
        return 0; /* no file yet: empty list */
    }

    char line[1024];
    while (fgets(line, sizeof line, file)) {
        line[strcspn(line, "\r\n")] = '\0';
        if ((line[0] != '0' && line[0] != '1') || line[1] != '|') {
            continue;
        }
        if (tasklist_add(list, line + 2) != 0) {
            fclose(file);
            return 1;
        }
        list->items[list->count - 1].done = line[0] == '1';
    }

    fclose(file);
    return 0;
}

int tasklist_save(const TaskList *list, const char *path) {
    FILE *file = fopen(path, "w");
    if (file == NULL) {
        return 1;
    }

    for (size_t i = 0; i < list->count; i++) {
        fprintf(file, "%d|%s\n", list->items[i].done ? 1 : 0, list->items[i].text);
    }

    return fclose(file) == 0 ? 0 : 1;
}
