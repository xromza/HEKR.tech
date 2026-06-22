package com.hekr.store.dto.order;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class PreOrderPriceResponseDto {
    public BigDecimal base;
    public BigDecimal applied;
    public String type;
}
