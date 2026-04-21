package com.hekr.store.mapper;


import com.hekr.store.dto.OrderStatusHistoryResponseDto;
import com.hekr.store.model.OrderStatusHistory;
import org.mapstruct.*;

import java.util.List;


@Mapper(componentModel = "spring")
public interface OrderStatusHistoryMapper {
    @Mapping(target = "orderId", source = "order.id")
    @Mapping(target = "status", source = "newStatus")
    @Mapping(target = "changedAt", source = "changedAt")
    @Mapping(target = "changedByName", ignore = true)  // требует отдельной логики
    @Mapping(target = "comment", source = "comment")
    OrderStatusHistoryResponseDto toResponseDto(OrderStatusHistory history);

    List<OrderStatusHistoryResponseDto> toResponseDtoList(List<OrderStatusHistory> histories);
}