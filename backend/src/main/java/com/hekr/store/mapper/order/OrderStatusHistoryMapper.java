package com.hekr.store.mapper.order;

import com.hekr.store.dto.order.OrderStatusHistoryResponseDto;
import com.hekr.store.model.order.OrderStatusHistory;

import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderStatusHistoryMapper {
    @Mapping(target = "orderId", source = "order.id")
    @Mapping(target = "status", source = "newStatus")
    @Mapping(target = "changedAt", source = "changedAt")
    @Mapping(target = "changedByName", ignore = true)
    @Mapping(target = "comment", source = "comment")
    OrderStatusHistoryResponseDto toDto(OrderStatusHistory history);

    List<OrderStatusHistoryResponseDto> toDtoList(List<OrderStatusHistory> histories);
}