package com.hekr.store.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Schema(
    description = "Запрос на элемент заказа",
    example = """
        {
          "variantId": 1,
          "quantity": 2
        }
        """
)
@AllArgsConstructor
@Data
@Builder
@NoArgsConstructor

public class OrderItemRequestDto {
    @Schema(description = "Идентификатор варианта товара", example = "1")
    @NotNull
    private Long variantId;
    @Schema(description = "Количество товара", example = "2")
    @Min(1)
    @NotNull
    private Long quantity;
}