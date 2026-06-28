package com.hekr.store.dto.stock;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StockResponsePlainDto {
    private Long variantId;
    private String sku;
    private String title;
    private Integer quantity;
    private String color;
    private String size;
}
