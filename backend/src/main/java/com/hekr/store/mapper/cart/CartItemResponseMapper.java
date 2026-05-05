package com.hekr.store.mapper.cart;

import com.hekr.store.dto.cart.CartItemResponseDto;
import com.hekr.store.model.cart.Cart;
import com.hekr.store.model.image.Image;
import com.hekr.store.model.product.Product;
import com.hekr.store.model.product.ProductVariant;
import com.hekr.store.utils.ImageType;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CartItemResponseMapper {
    @Mapping(target = "variantId", source = "id.variantId")
    @Mapping(target = "title", source = "productVariant.product.title")
    @Mapping(target = "quantity", source = "quantity")
    @Mapping(target = "appliedPrice", ignore = true)
    @Mapping(target = "subtotal", ignore = true)
    @Mapping(target = "availableStock", ignore = true)
    @Mapping(target = "imageUrl", ignore = true)
    @Mapping(target = "brand", ignore = true)
    @Mapping(target = "priceType", ignore = true)
    CartItemResponseDto toDto(Cart cart);

    List<CartItemResponseDto> toResponseList(List<Cart> carts);

    @AfterMapping
    default void setAppliedPriceAndSubtotalAndPriceType(Cart cart,
            @MappingTarget CartItemResponseDto.CartItemResponseDtoBuilder dtoBuilder) {
        if (cart.getProductVariant() != null && cart.getProductVariant().getProduct() != null) {
            boolean isWholesale = cart.getQuantity() >= cart.getProductVariant().getProduct().getWholesaleThreshold();

            ProductVariant variant = cart.getProductVariant();
            Product product = variant.getProduct();

            BigDecimal price = isWholesale
                    ? product.getPriceWholesale()
                    : product.getPriceRetail();
            dtoBuilder.appliedPrice(price);
            dtoBuilder.priceType(isWholesale ? "WHOLESALE" : "RETAIL");
            dtoBuilder.subtotal(price.multiply(BigDecimal.valueOf(cart.getQuantity())));
        }
    }

    @AfterMapping
    default void setAvailableStock(Cart cart,
            @MappingTarget CartItemResponseDto.CartItemResponseDtoBuilder dtoBuilder) {
        if (cart.getProductVariant() != null && cart.getProductVariant().getStocks() != null
                && !cart.getProductVariant().getStocks().isEmpty()) {
            Long totalStock = cart.getProductVariant().getStocks().stream()
                    .mapToLong(stock -> stock.getQuantity())
                    .sum();
            dtoBuilder.availableStock(totalStock.intValue());
        }
    }

    @AfterMapping
    default void fillBrand(@MappingTarget CartItemResponseDto.CartItemResponseDtoBuilder dto, Cart cart) {
        dto.brand(cart.getProductVariant().getProduct().getBrand());
    }

    @AfterMapping
    default void setImageUrl(Cart cart, @MappingTarget CartItemResponseDto.CartItemResponseDtoBuilder dtoBuilder) {
        if (cart.getProductVariant() != null && cart.getProductVariant().getImages() != null) {
            Optional<String> mainImageUrl = cart.getProductVariant().getImages().stream()
                    .filter(img -> img.getType() == ImageType.MAIN)
                    .map(Image::getUrl)
                    .findFirst()
                    .or(() -> cart.getProductVariant().getImages().stream()
                            .map(Image::getUrl)
                            .findFirst());
            mainImageUrl.ifPresent(dtoBuilder::imageUrl);
        }
    }
}