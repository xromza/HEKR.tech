package com.hekr.store.mapper;

import com.hekr.store.dto.DiscountDto;
import com.hekr.store.model.Discount;
import org.mapstruct.*;

import java.util.List;


@Mapper(componentModel = "spring")
public interface DiscountMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", ignore = true)
    Discount toEntity(DiscountDto dto);

    List<Discount> toEntityList(List<DiscountDto> dtos);
}