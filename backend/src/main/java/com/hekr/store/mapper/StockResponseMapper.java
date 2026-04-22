package com.hekr.store.mapper;


import com.hekr.store.model.Stock;
import org.mapstruct.*;
import com.hekr.store.dto.StockResponseDto;

import java.util.Collection;
import java.util.List;

@Mapper(componentModel = "spring")

public interface StockResponseMapper {
    @Mapping(target = "warehouseAddress",source = "warehouse.address")
    StockResponseDto toResponse(Stock stock);
    List<StockResponseDto> toResponseList(Collection<Stock> stock);
}