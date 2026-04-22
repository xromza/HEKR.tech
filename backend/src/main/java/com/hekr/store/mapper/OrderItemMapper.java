package com.hekr.store.mapper;

import com.hekr.store.dto.OrderItemResponseDto;
import com.hekr.store.model.Image;
import com.hekr.store.model.OrderItem;
import com.hekr.store.utils.ImageType;
import org.mapstruct.*;

import java.util.List;
import java.util.Optional;

@Mapper(componentModel = "spring")
public interface OrderItemMapper {
    @Mapping(target = "productId", source = "productVariant.product.id")
    @Mapping(target = "variantId", source = "id.variantId")
    @Mapping(target = "title", source = "productVariant.product.title")
    @Mapping(target = "sku", source = "productVariant.sku")
    @Mapping(target = "size", source = "productVariant.size")
    @Mapping(target = "color", source = "productVariant.color")
    @Mapping(target = "mainImageUrl", ignore = true)
    @Mapping(target = "quantity", source = "quantity")
    @Mapping(target = "appliedPrice", source = "priceAtPurchase")
    @Mapping(target = "subtotal", source = "totalPrice")
    @Mapping(target = "availableStock", ignore = true)
    OrderItemResponseDto toDto(OrderItem orderItem);

    @AfterMapping
    default void setMainImageUrl(OrderItem orderItem, @MappingTarget OrderItemResponseDto dto) {
        if (orderItem.getProductVariant() != null && orderItem.getProductVariant().getImages() != null) {
            Optional<String> mainImageUrl = orderItem.getProductVariant().getImages().stream()
                .filter(img -> img.getType() == ImageType.MAIN)
                .map(Image::getUrl)
                .findFirst()
                .or(() -> orderItem.getProductVariant().getImages().stream()
                    .map(Image::getUrl)
                    .findFirst());
            mainImageUrl.ifPresent(dto::setMainImageUrl);
        }
    }

    @AfterMapping
    default void setAvailableStock(OrderItem orderItem, @MappingTarget OrderItemResponseDto dto) {
        if (orderItem.getProductVariant() != null && orderItem.getProductVariant().getStocks() != null && !orderItem.getProductVariant().getStocks().isEmpty()) {
            Long totalStock = orderItem.getProductVariant().getStocks().stream()
                .mapToLong(stock -> stock.getQuantity())
                .sum();
            dto.setAvailableStock(totalStock.intValue());
        }
    }

    List<OrderItemResponseDto> toDtoList(List<OrderItem> orderItems);
}