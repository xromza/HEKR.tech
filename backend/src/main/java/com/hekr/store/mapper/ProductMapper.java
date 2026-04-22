package com.hekr.store.mapper;

import com.hekr.store.dto.ProductResponseDto;
import com.hekr.store.model.Image;
import com.hekr.store.model.Product;
import com.hekr.store.utils.ImageType;
import org.mapstruct.*;

import java.util.List;
import java.util.Optional;

@Mapper(componentModel = "spring", uses = ProductVariantMapper.class)
public interface ProductMapper {

    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "variants", source = "variants")
    @Mapping(target = "mainImageUrl", ignore = true)
    @Mapping(target = "categoryId", source = "category.id")
    ProductResponseDto toResponse(Product product);

    @AfterMapping
    default void setMainImageUrl(Product product, @MappingTarget ProductResponseDto dto) {
        if (product.getVariants() != null && !product.getVariants().isEmpty()) {
            Optional<String> mainImageUrl = product.getVariants().stream()
                .flatMap(v -> v.getImages().stream())
                .filter(img -> img.getType() == ImageType.MAIN)
                .map(Image::getUrl)
                .findFirst()
                .or(() -> product.getVariants().stream()
                    .flatMap(v -> v.getImages().stream())
                    .map(Image::getUrl)
                    .findFirst());
            mainImageUrl.ifPresent(dto::setMainImageUrl);
        }
    }

    List<ProductResponseDto> toResponseList(List<Product> products);
}