package com.hekr.store.mapper.stock;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.hekr.store.dto.order.ItemWarehouseAvailabilityResponseDto;
import com.hekr.store.model.stock.Stock;

@Mapper(componentModel = "spring")
public interface StockAvailabilityMapper {

    @Mapping(target="warehouseId", source = "warehouse.id")
    @Mapping(target="availableQuantity", source = "quantity")
    ItemWarehouseAvailabilityResponseDto toResponse(Stock stock);
}
