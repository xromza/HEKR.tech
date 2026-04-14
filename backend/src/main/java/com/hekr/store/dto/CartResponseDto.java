package com.hekr.store.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Setter;
import lombok.Getter;
import java.math.BigDecimal;


@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor

public class CartResponseDto {
    @Schema(description = "Id варианта товара",example = "22")
    private Long variantId;
    @Schema(description = "Название товара",example = "Gucci slim jeans")
    private String name;
    @Schema(description = "Количество товаров в корзине",example = "3")
    private Long quantity;
    @Schema(description = "Общая цена",example = "1337.00")
    private BigDecimal totalPrice;
    @Schema(description = "Есть ли товар в наличии", example = "true", nullable = true)
    private Boolean inStock;
}