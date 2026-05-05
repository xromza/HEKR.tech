package com.hekr.store.mapper.category;

import com.hekr.store.dto.category.CategoryResponseDto;
import com.hekr.store.model.category.Category;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategoryResponseMapper {
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "discount", source = "discount.discount")
    @Mapping(target = "count", ignore = true)
    CategoryResponseDto toDto(Category category);


    
    List<CategoryResponseDto> toResponseList(List<Category> categories);
}