package com.hekr.store.model.cart;

import java.io.Serializable;

import jakarta.persistence.Embeddable;
import lombok.Builder;

@Embeddable
@Builder
public record CartItemId(Long userId, Long variantId) implements Serializable{}