package com.hekr.store.mapper.cart;

import com.hekr.store.dto.cart.CartRequestDto;
import com.hekr.store.model.cart.Cart;

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