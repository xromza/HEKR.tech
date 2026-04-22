package com.hekr.store.mapper;

import com.hekr.store.dto.WarehouseRequestDto;
import com.hekr.store.dto.WarehouseResponseDto;
import com.hekr.store.model.Warehouse;
import org.mapstruct.*;
import java.util.List;


@Mapper

public interface WarehouseMapper {
    Warehouse toEntity(WarehouseRequestDto requestDto);

    WarehouseResponseDto toResponse(Warehouse warehouse);

    List<WarehouseResponseDto> toResponseList(List<Warehouse> warehouses);

}