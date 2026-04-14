package com.hekr.store.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Setter;
import lombok.Getter;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor

public class OrderItemRequestDto {
    @Schema(description = "Вариант товара",example="1")
    @NotNull
    private Long variantId;
    @Schema(description = "Количество товаров",example="2")
    @Min(1)
    @NotNull
    private Long quantity;
    @Schema(description="Комментарий")
    @Size(max=500)
    private String comment;
}