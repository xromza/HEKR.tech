package com.hekr.store.model.stock;

import java.io.Serializable;

import jakarta.persistence.Embeddable;

@Embeddable
public record StockId (
    Long variantId, 
    Long warehouseId
) implements Serializable {};