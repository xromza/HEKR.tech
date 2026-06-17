package com.hekr.store.mapper.order;

import com.hekr.store.dto.order.SingleCheckoutRequestDto;
import com.hekr.store.model.order.Order;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SingleCheckoutRequestMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "warehouse", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "date", ignore = true)
    @Mapping(target = "price", ignore = true)
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "history", ignore = true)
    @Mapping(target = "address", source = "address")
    @Mapping(target = "payment", source = "payment")
    @Mapping(target = "comment", source = "comment")
    Order toOrder(SingleCheckoutRequestDto dto);
}
