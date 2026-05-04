package com.hekr.store.mapper.order;

import com.hekr.store.dto.order.OrderItemResponseDto;
import com.hekr.store.model.image.Image;
import com.hekr.store.model.order.OrderItem;
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
    @Mapping(target = "priceType", ignore = true)
    OrderItemResponseDto toDto(OrderItem orderItem);

    @AfterMapping
    default void setMainImageUrl(OrderItem orderItem,
            @MappingTarget OrderItemResponseDto.OrderItemResponseDtoBuilder dtoBuilder) {
        if (orderItem.getProductVariant() != null && orderItem.getProductVariant().getImages() != null) {
            Optional<String> mainImageUrl = orderItem.getProductVariant().getImages().stream()
                    .filter(img -> img.getType() == ImageType.THUMBNAIL)
                    .map(Image::getUrl)
                    .findFirst()
                    .or(() -> orderItem
                            .getProductVariant()
                            .getImages()
                            .stream()
                            .map(Image::getUrl)
                            .findFirst());
            mainImageUrl.ifPresent(dtoBuilder::mainImageUrl);
        }
    }

    @AfterMapping
    default void setPriceType(OrderItem orderItem,
            @MappingTarget OrderItemResponseDto.OrderItemResponseDtoBuilder dtoBuilder) {
        if (orderItem.getProductVariant() != null && orderItem.getProductVariant().getProduct() != null) {
            boolean isWholesale = orderItem.getProductVariant().getProduct().getWholesaleThreshold() <= orderItem.getQuantity();
            dtoBuilder.priceType(isWholesale ? "WHOLESALE" : "RETAIL");
        }
    }

    List<OrderItemResponseDto> toDtoList(List<OrderItem> orderItems);
}