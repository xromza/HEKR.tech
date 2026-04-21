package com.hekr.store.mapper;

import com.hekr.store.dto.ProductResponseDto;
import com.hekr.store.model.Product;
import org.mapstruct.*;
import java.util.List;


@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "variants", source = "variants")
    @Mapping(target = "mainImageUrl", ignore = true)
    ProductResponseDto toResponse(Product product);

    List<ProductResponseDto> toResponseList(List<Product> products);
}