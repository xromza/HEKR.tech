package com.hekr.store.dto.product;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductRequestDto {
    private String title;
    private String description;
    private String brand;
    private BigDecimal priceRetail;
    private BigDecimal priceWholesale;
    private Integer wholesaleThreshold;
    private Long categoryId;
}
