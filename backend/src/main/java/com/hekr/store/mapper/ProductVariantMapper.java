package com.hekr.store.mapper;

import com.hekr.store.dto.ProductVariantResponseDto;
import com.hekr.store.model.ProductVariant;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductVariantMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "product",ignore = true)
    @Mapping(target = "stocks", ignore = true)
    @Mapping(target = "images", ignore = true)
    ProductVariant toEntity(ProductVariantResponseDto dto);

    @Mapping(target="productId",source="product.id")
    @Mapping(target = "stock", source = "stocks")
    @Mapping(target = "images", source = "images")
    ProductVariantResponseDto toDto(ProductVariant variant);

    List<ProductVariant> toEntityList(List<ProductVariantResponseDto> dtos);
    List<ProductVariantResponseDto> toDtoList(List<ProductVariant> variants);

}