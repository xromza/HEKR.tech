package com.hekr.store.mapper;

import com.hekr.store.dto.OrderResponseDto;
import com.hekr.store.model.Order;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")

public interface OrderResponseMapper {
    @Mapping(target = "id",source="id")
    @Mapping(target = "userId",source="user.id")
    @Mapping(target = "warehouseId",source="warehouse.id")
    @Mapping(target ="totalPrice",source="price")
    @Mapping(target = "payment_method",source="payment")
    @Mapping(target="adress",source="adress")
    @Mapping(target = "status",source="status")
    @Mapping(target = "items",source="items")
    @Mapping(target = "statusHistory",source="statusHistory")
    @Mapping(target = "date",source="date")
    @Mapping(target = "priceType",source="priceType")
    OrderResponseDto toDto(Order order);

    List<OrderResponseDto> toDtoList(List<Order> orders);
}