package com.hekr.store.utils;

public enum CategoryType {
    MEN(1L),
    WOMEN(2L),
    ACCESSORIES(3L),
    SHOES(4L);

    private final Long id;
    CategoryType(Long id) { this.id = id; }
    public final Long getId() { return this.id; }
}