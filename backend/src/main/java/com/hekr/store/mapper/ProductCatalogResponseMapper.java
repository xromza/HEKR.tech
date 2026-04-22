package com.hekr.store.mapper;

import com.hekr.store.dto.ProductCatalogResponseDto;
import com.hekr.store.model.Image;
import com.hekr.store.model.Product;
import com.hekr.store.utils.ImageType;
import org.mapstruct.*;

import java.util.List;
import java.util.Optional;

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
    default void setMainImageUrl(Product product, @MappingTarget ProductCatalogResponseDto dto) {
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

    List<ProductCatalogResponseDto> toResponseList(List<Product> products);
}
