package com.hekr.store.mapper;

import com.hekr.store.dto.CategoryResponseDto;
import com.hekr.store.model.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategoryResponseMapper {
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "discount", source = "discount.discount")
    CategoryResponseDto toDto(Category category);

    List<CategoryResponseDto> toResponseList(List<Category> categories);
}