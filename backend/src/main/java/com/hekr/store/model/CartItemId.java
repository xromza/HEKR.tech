package com.hekr.store.model;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
@Embeddable
public record CartItemId(Long userId, Long variantId) implements Serializable{}
