package com.hekr.store.dto.order;

import java.util.List;

import lombok.Getter;

@Getter
public class PreOrderRequestDto {

    public List<OrderItemRequestDto> items;    

}
