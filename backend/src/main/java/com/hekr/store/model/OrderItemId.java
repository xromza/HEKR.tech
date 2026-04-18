package com.hekr.store.model;

import java.io.Serializable;

import jakarta.persistence.Embeddable;

@Embeddable
public record OrderItemId(Long orderId, Long variantId) implements Serializable {}