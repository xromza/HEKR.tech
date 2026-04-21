package com.hekr.store.mapper;

import com.hekr.store.dto.OrderItemResponseDto;
import com.hekr.store.model.OrderItem;
import org.mapstruct.*;

import java.util.List;


@Mapper(componentModel = "spring")
public interface OrderItemMapper {
    @Mapping(target = "productId", source = "productVariant.product.id")
    @Mapping(target = "variantId", source = "productVariant.id")
    @Mapping(target = "title", source = "productVariant.product.title")
    @Mapping(target = "sku", source = "productVariant.sku")
    @Mapping(target = "size", source = "productVariant.size")
    @Mapping(target = "color", source = "productVariant.color")
    @Mapping(target = "mainImageUrl", ignore = true)
    @Mapping(target = "quantity", source = "quantity")
    @Mapping(target = "appliedPrice", source = "priceAtPurchase")
    @Mapping(target = "subtotal", source = "totalPrice")
    @Mapping(target = "availableStock", ignore = true)
    OrderItemResponseDto toResponseDto(OrderItem orderItem);

    List<OrderItemResponseDto> toResponseDtoList(List<OrderItem> orderItems);
}