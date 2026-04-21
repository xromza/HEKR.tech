package com.hekr.store.mapper;


import com.hekr.store.dto.CartResponseDto;
import com.hekr.store.model.Cart;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CartResponseMapper {
    @Mapping(target = "items", source = "carts")
    @Mapping(target = "total_price", ignore = true)
    @Mapping(target = "discount_applied", ignore = true)
    @Mapping(target = "can_checkout", ignore = true)
    CartResponseDto toResponse(List<Cart> carts);
}