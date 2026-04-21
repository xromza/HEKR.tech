package com.hekr.store.mapper;

import com.hekr.store.dto.CartItemResponseDto;
import com.hekr.store.model.Cart;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")

public interface CartItemResponseMapper {
    @Mapping(target = "variantId", source = "productVariant.id")
    @Mapping(target = "title", source = "productVariant.product.title")
    @Mapping(target = "appliedPrice", ignore = true)
    @Mapping(target = "subtotal", ignore = true)
    @Mapping(target = "availableStock", ignore = true)
    @Mapping(target = "priceType", ignore = true)
    @Mapping(target = "imageUrl", ignore = true)
    CartItemResponseDto toResponse(Cart cart);

    List<CartItemResponseDto> toResponseList(List<Cart> carts);
}