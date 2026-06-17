package com.hekr.store.mapper.warehouse;

import com.hekr.store.dto.warehouse.WarehouseRequestDto;
import com.hekr.store.dto.warehouse.WarehouseResponseDto;
import com.hekr.store.model.warehouse.Warehouse;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface WarehouseMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "address", source = "address")
    Warehouse toEntity(WarehouseRequestDto requestDto);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "address", source = "address")
    WarehouseResponseDto toResponse(Warehouse warehouse);

    List<WarehouseResponseDto> toResponseList(List<Warehouse> warehouses);
}