package com.hekr.store.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Setter;
import lombok.Getter;
import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class OrderItemResponseDto {
    @Schema(description="Id варианта товара",example="3")
    private Long variantId;
    @Schema(description = "Количество",example="8")
    private Long quantity;
    @Schema(description = "Итоговая цена",example = "1337.00")
    private BigDecimal price;
    @Schema(description = "Комментарий к заказу")
    private String comment;
}