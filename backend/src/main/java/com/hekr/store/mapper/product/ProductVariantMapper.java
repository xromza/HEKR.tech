package com.hekr.store.mapper.product;

import com.hekr.store.dto.product.ProductVariantResponseDto;
import com.hekr.store.mapper.image.ImageMapper;
import com.hekr.store.mapper.stock.StockResponseMapper;
import com.hekr.store.model.product.ProductVariant;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {StockResponseMapper.class, ImageMapper.class})
public interface ProductVariantMapper {
    @Mapping(target = "id", source = "id")
    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "sku", source = "sku")
    @Mapping(target = "size", source = "size")
    @Mapping(target = "color", source = "color")
    @Mapping(target = "stock", source = "stocks")
    @Mapping(target = "isActive", source = "isActive")
    @Mapping(target = "images", source = "images")
    ProductVariantResponseDto toDto(ProductVariant variant);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "stocks", ignore = true)
    @Mapping(target = "images", ignore = true)
    @Mapping(target = "size", source = "size")
    @Mapping(target = "color", source = "color")
    @Mapping(target = "weight", source = "weight")
    @Mapping(target = "sku", source = "sku")
    @Mapping(target = "isActive", source = "isActive")
    ProductVariant toEntity(ProductVariantResponseDto dto);

    List<ProductVariant> toEntityList(List<ProductVariantResponseDto> dtos);
    List<ProductVariantResponseDto> toDtoList(List<ProductVariant> variants);
}