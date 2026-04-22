package com.hekr.store.mapper;

import com.hekr.store.dto.CartRequestDto;
import com.hekr.store.model.Cart;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CartRequestMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "productVariant", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "quantity", source = "quantity")
    Cart toEntity(CartRequestDto dto);
}