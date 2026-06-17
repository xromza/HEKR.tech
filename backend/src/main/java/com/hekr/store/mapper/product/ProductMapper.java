package com.hekr.store.mapper.product;

import com.hekr.store.dto.product.ProductResponseDto;
import com.hekr.store.model.image.Image;
import com.hekr.store.model.product.Product;
import com.hekr.store.utils.ImageType;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = ProductVariantMapper.class)
public interface ProductMapper {

    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "variants", source = "variants")
    @Mapping(target = "mainImageUrl", ignore = true)
    @Mapping(target = "categoryId", source = "category.id")
    ProductResponseDto toResponse(Product product);

    @AfterMapping
    default void setMainImageUrl(Product product,
            @MappingTarget ProductResponseDto.ProductResponseDtoBuilder dtoBuilder) {
        if (product.getVariants() == null)
            return;

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

    List<ProductResponseDto> toResponseList(List<Product> products);
}