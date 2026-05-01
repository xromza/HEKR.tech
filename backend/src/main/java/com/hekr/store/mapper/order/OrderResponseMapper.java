package com.hekr.store.mapper.order;

import com.hekr.store.dto.order.OrderResponseDto;
import com.hekr.store.model.order.Order;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {OrderItemMapper.class, OrderStatusHistoryMapper.class})
public interface OrderResponseMapper {
    @Mapping(target = "id", source = "id")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "warehouseId", source = "warehouse.id")
    @Mapping(target = "totalPrice", source = "price")
    @Mapping(target = "address", source = "address")
    @Mapping(target = "paymentMethod", source = "payment")
    @Mapping(target = "status", source = "status")
    @Mapping(target = "date", source = "date")
    @Mapping(target = "items", source = "items")
    @Mapping(target = "statusHistory", source = "history")
    OrderResponseDto toDto(Order order);

    List<OrderResponseDto> toDtoList(List<Order> orders);
}