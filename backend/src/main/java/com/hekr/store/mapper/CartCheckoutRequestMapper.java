package com.hekr.store.mapper;

import com.hekr.store.dto.CartCheckoutRequestDto;
import com.hekr.store.model.Order;
import org.mapstruct.*;



@Mapper(componentModel = "spring")
public interface CartCheckoutRequestMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "warehouse", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "date", ignore = true)
    @Mapping(target = "price", ignore = true)
    @Mapping(target = "orderItems", ignore = true)
    @Mapping(target = "address", source = "address")
    @Mapping(target = "payment", source = "payment")
    @Mapping(target = "comment", source = "comment")
    Order toOrder(CartCheckoutRequestDto dto);
}