package com.hekr.store.mapper.order;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.hekr.store.dto.order.PreOrderItemResponseDto;
import com.hekr.store.model.image.Image;
import com.hekr.store.model.product.Product;
import com.hekr.store.model.product.ProductVariant;
import com.hekr.store.utils.ImageType;

@Mapper(componentModel = "spring")
public interface PreOrderMapper {
    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "variantId", source = "id")
    @Mapping(target = "brand", source = "product.brand")
    @Mapping(target = "sku", source = "sku")
    @Mapping(target = "size", source = "size")
    @Mapping(target = "color", source = "color")
    @Mapping(target = "mainImageUrl", ignore = true)
    @Mapping(target = "quantity", ignore = true)
    @Mapping(target = "price", ignore = true)
    @Mapping(target = "subtotal", ignore = true)
    @Mapping(target = "availableAtWarehouses", ignore = true)
    @Mapping(target = "title", source = "product.title")
    @Mapping(target = "maxAvailableQuantity", ignore = true)
    @Mapping(target = "isAvailable", ignore = true)
    PreOrderItemResponseDto toPreOrder(ProductVariant productVariant);

    @AfterMapping
    default void setMainImageUrl(ProductVariant productVariant,
            @MappingTarget PreOrderItemResponseDto.PreOrderItemResponseDtoBuilder dtoBuilder) {
        Product product = productVariant.getProduct();
        product.getVariants().stream()
                .filter(v -> v.getImages() != null)
                .flatMap(v -> v.getImages().stream())
                .filter(img -> img.getType() == ImageType.THUMBNAIL)
                .map(Image::getUrl)
                .findFirst()
                .or(() -> product.getVariants().stream()
                        .filter(v -> v.getImages() != null)
                        .flatMap(v -> v.getImages().stream())
                        .filter(img -> img.getType() == ImageType.MAIN)
                        .map(Image::getUrl)
                        .findFirst())
                .or(() -> product.getVariants().stream()
                        .filter(v -> v.getImages() != null)
                        .flatMap(v -> v.getImages().stream())
                        .map(Image::getUrl)
                        .findFirst())
                .ifPresent(dtoBuilder::mainImageUrl);
    }

}
