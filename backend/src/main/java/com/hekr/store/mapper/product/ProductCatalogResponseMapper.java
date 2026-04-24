package com.hekr.store.mapper.product;

import com.hekr.store.dto.product.ProductCatalogResponseDto;
import com.hekr.store.model.image.Image;
import com.hekr.store.model.product.Product;
import com.hekr.store.utils.ImageType;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductCatalogResponseMapper {
    @Mapping(target = "id", source = "id")
    @Mapping(target = "title", source = "title")
    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "isActive", source = "isActive")
    @Mapping(target = "priceWholesale", source = "priceWholesale")
    @Mapping(target = "priceRetail", source = "priceRetail")
    @Mapping(target = "mainImageUrl", ignore = true)
    ProductCatalogResponseDto toResponse(Product product);

    @AfterMapping
    default void setMainImageUrl(Product product,
            @MappingTarget ProductCatalogResponseDto.ProductCatalogResponseDtoBuilder dtoBuilder) {
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

    List<ProductCatalogResponseDto> toResponseList(List<Product> products);
}
