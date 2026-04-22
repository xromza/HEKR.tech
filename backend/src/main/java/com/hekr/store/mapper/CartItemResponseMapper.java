package com.hekr.store.mapper;

import com.hekr.store.dto.CartItemResponseDto;
import com.hekr.store.model.Cart;
import com.hekr.store.model.Image;
import com.hekr.store.utils.ImageType;
import org.mapstruct.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Mapper(componentModel = "spring")
public interface CartItemResponseMapper {
    @Mapping(target = "variantId", source = "id.variantId")
    @Mapping(target = "title", source = "productVariant.product.title")
    @Mapping(target = "quantity", source = "quantity")
    @Mapping(target = "appliedPrice", ignore = true)
    @Mapping(target = "subtotal", ignore = true)
    @Mapping(target = "availableStock", ignore = true)
    @Mapping(target = "priceType", constant = "RETAIL")
    @Mapping(target = "imageUrl", ignore = true)
    CartItemResponseDto toDto(Cart cart);

    List<CartItemResponseDto> toResponseList(List<Cart> carts);

    @AfterMapping
    default void setAppliedPriceAndSubtotal(Cart cart, @MappingTarget CartItemResponseDto dto) {
        if (cart.getProductVariant() != null && cart.getProductVariant().getProduct() != null) {
            BigDecimal price = cart.getProductVariant().getProduct().getPriceRetail();
            dto.setAppliedPrice(price);
            dto.setSubtotal(price.multiply(BigDecimal.valueOf(cart.getQuantity())));
        }
    }

    @AfterMapping
    default void setAvailableStock(Cart cart, @MappingTarget CartItemResponseDto dto) {
        if (cart.getProductVariant() != null && cart.getProductVariant().getStocks() != null && !cart.getProductVariant().getStocks().isEmpty()) {
            Long totalStock = cart.getProductVariant().getStocks().stream()
                .mapToLong(stock -> stock.getQuantity())
                .sum();
            dto.setAvailableStock(totalStock.intValue());
        }
    }

    @AfterMapping
    default void setImageUrl(Cart cart, @MappingTarget CartItemResponseDto dto) {
        if (cart.getProductVariant() != null && cart.getProductVariant().getImages() != null) {
            Optional<String> mainImageUrl = cart.getProductVariant().getImages().stream()
                .filter(img -> img.getType() == ImageType.MAIN)
                .map(Image::getUrl)
                .findFirst()
                .or(() -> cart.getProductVariant().getImages().stream()
                    .map(Image::getUrl)
                    .findFirst());
            mainImageUrl.ifPresent(dto::setImageUrl);
        }
    }
}