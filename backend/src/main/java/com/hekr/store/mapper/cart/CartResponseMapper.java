package com.hekr.store.mapper.cart;

import com.hekr.store.dto.cart.CartItemResponseDto;
import com.hekr.store.dto.cart.CartResponseDto;
import com.hekr.store.model.cart.Cart;
import com.hekr.store.model.image.Image;
import com.hekr.store.model.stock.Stock;
import com.hekr.store.utils.ImageType;


import java.math.BigDecimal;
import java.util.List;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", uses = CartItemResponseMapper.class)
public abstract class CartResponseMapper {

    @Autowired
    protected CartItemResponseMapper itemMapper;

    public CartResponseDto toDto(List<Cart> carts) {
        if (carts == null) {
            return null;
        }

        List<CartItemResponseDto> items = itemMapper.toResponseList(carts);

        CartResponseDto dto = CartResponseDto.builder()
                .items(items)
                .build();

        calculateTotals(carts, dto);

        return dto;
    }

    @Mapping(target = "variantId", source = "productVariant.id")
    @Mapping(target = "title", source = "productVariant.product.title")
    @Mapping(target = "quantity", source = "quantity")
    @Mapping(target = "appliedPrice", source = "productVariant.product.priceRetail")
    @Mapping(target = "availableStock", ignore = true)
    @Mapping(target = "priceType", constant = "RETAIL")
    @Mapping(target = "imageUrl", ignore = true)

    @Mapping(target = "subtotal", expression = "java(cart.getProductVariant().getProduct().getPriceRetail().multiply(java.math.BigDecimal.valueOf(cart.getQuantity())))")
    public abstract CartItemResponseDto toResponse(Cart cart);

    @AfterMapping
    protected void calculateTotals(List<Cart> carts, @MappingTarget CartResponseDto dto) {
        BigDecimal totalPrice = BigDecimal.ZERO;
        if (carts != null) {
            for (Cart cart : carts) {
                if (cart.getProductVariant() != null && cart.getProductVariant().getProduct() != null) {
                    var product = cart.getProductVariant().getProduct();

                    boolean isWholesale = cart.getQuantity() >= product.getWholesaleThreshold();

                    BigDecimal pricePerUnit = isWholesale ? product.getPriceWholesale() : product.getPriceRetail();
                    BigDecimal itemTotal = pricePerUnit.multiply(BigDecimal.valueOf(cart.getQuantity()));

                    totalPrice = totalPrice.add(itemTotal);
                }
            }
        }
        dto.setTotal_price(totalPrice);
        dto.setDiscount_applied(false);
        dto.setCan_checkout(carts != null && !carts.isEmpty());
    }

    @AfterMapping
    protected void fillRemainingFields(@MappingTarget CartItemResponseDto dto, Cart cart) {

        if (cart.getProductVariant() != null) {
            String imageKey = cart.getProductVariant()
                    .getImages()
                    .stream()
                    .filter(image -> image.getType() == ImageType.MAIN)
                    .map(Image::getUrl)
                    .findFirst()
                    .orElse(null);
            if (imageKey != null) {
                dto.setImageUrl(imageKey);
            }
            Integer countStock = cart.getProductVariant().getStocks().stream().mapToInt(Stock::getQuantity).sum();

            dto.setAvailableStock(countStock);
        }
    }
}