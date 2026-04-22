package com.hekr.store.mapper;

import com.hekr.store.dto.DiscountDto;
import com.hekr.store.model.Discount;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DiscountMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "discount", source = "discount")
    Discount toEntity(DiscountDto dto);

    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "discount", source = "discount")
    DiscountDto toDto(Discount entity);

    List<Discount> toEntityList(List<DiscountDto> dtos);

    List<DiscountDto> toDtoList(List<Discount> entities);
}