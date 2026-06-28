package com.hekr.store.mapper.category;

import com.hekr.store.dto.category.CategoryRequestDto;
import com.hekr.store.model.category.Category;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategoryRequestMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "discount", ignore = true)
    @Mapping(target = "name", source = "name")
    Category toEntity(CategoryRequestDto dto);

    List<Category> toEntityList(List<CategoryRequestDto> dtos);
}