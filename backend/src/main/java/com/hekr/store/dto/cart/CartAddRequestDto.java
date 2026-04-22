package com.hekr.store.dto.cart;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartAddRequestDto {
    @Schema(description = "ID варианта товара", example = "101")
    @NotNull
    private Long variantId;

    @Schema(description = "Количество", example = "5")
    @Min(1)
    private Long quantity;
}