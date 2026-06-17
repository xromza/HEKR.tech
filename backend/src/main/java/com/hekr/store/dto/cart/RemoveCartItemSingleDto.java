package com.hekr.store.dto.cart;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class RemoveCartItemSingleDto {
    private Long variantId;
    private String title;
    private String message;    
}
