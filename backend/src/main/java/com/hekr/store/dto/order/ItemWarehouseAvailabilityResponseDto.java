package com.hekr.store.dto.order;

import lombok.Getter;

@Getter
public class ItemWarehouseAvailabilityResponseDto {
    public Long warehouseId;
    public Integer availableQuantity;
}
