package com.hekr.store.mapper;


import com.hekr.store.dto.CategoryRequestDto;
import com.hekr.store.model.Category;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")

public interface CategoryRequestMapper {
    @Mapping(target = "id",ignore = true)
    @Mapping(target = "discount",ignore = true)
    @Mapping(target = "name",source="name")
    Category toEntity(CategoryRequestDto dto);

    List<Category> toEntityList(List<CategoryRequestDto> dtos);
}