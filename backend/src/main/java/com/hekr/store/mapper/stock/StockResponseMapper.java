package com.hekr.store.mapper.stock;

import com.hekr.store.dto.stock.StockResponseDto;
import com.hekr.store.model.stock.Stock;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Collection;
import java.util.List;

@Mapper(componentModel = "spring")
public interface StockResponseMapper {
    @Mapping(target = "variantId", source = "id.variantId")
    @Mapping(target = "warehouseId", source = "id.warehouseId")
    @Mapping(target = "address", source = "warehouse.address")
    @Mapping(target = "quantity", source = "quantity")
    StockResponseDto toResponse(Stock stock);

    List<StockResponseDto> toResponseList(Collection<Stock> stock);
}