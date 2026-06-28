package com.hekr.store.mapper.stock;

import com.hekr.store.dto.stock.StockResponsePlainDto;
import com.hekr.store.model.stock.Stock;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Collection;
import java.util.List;

@Mapper(componentModel = "spring")
public interface StockResponsePlainMapper {
    @Mapping(target = "variantId", source = "id.variantId")
    @Mapping(target = "sku", source = "variant.sku")
    @Mapping(target = "title", source = "variant.product.title")
    @Mapping(target = "quantity", source = "quantity")
    @Mapping(target = "color", source = "variant.color")
    @Mapping(target = "size", source = "variant.size")
    StockResponsePlainDto toResponse(Stock stock);

    List<StockResponsePlainDto> toResponseList(Collection<Stock> stock);
}