package com.hekr.store.model;

import java.io.Serializable;

public record OrderItemId(Long orderId, Long variantId) implements Serializable {}