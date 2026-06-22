package com.hekr.store.dto.order;

import java.math.BigDecimal;
import java.util.List;

import com.hekr.store.dto.warehouse.PreOrderWarehouseResponseDto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Builder
@Setter
public class PreOrderResponseDto {
    public BigDecimal totalPrice;
    public List<PreOrderItemResponseDto> items;
    public List<PreOrderWarehouseResponseDto> warehouses;
}
