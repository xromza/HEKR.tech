package com.hekr.store.dto.product;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ProductVariantRequestDto {
    private String size;
    private String color;
    private String sku;
}
