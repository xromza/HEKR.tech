package com.hekr.store.mapper.order;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.hekr.store.dto.order.OrderRequestDto;
import com.hekr.store.model.order.Order;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "warehouse", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "date", ignore = true)
    @Mapping(target = "price", ignore = true)
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "history", ignore = true)
    @Mapping(target = "comment", source = "comment")
    @Mapping(target = "payment", source = "payment")
    @Mapping(target = "address", source = "address")
    Order toOrder(OrderRequestDto dto);
}
