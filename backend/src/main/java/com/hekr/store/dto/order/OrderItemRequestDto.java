package com.hekr.store.dto.order;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

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
@Getter
@Setter
@Builder
@NoArgsConstructor

public class OrderItemRequestDto {
    @Schema(description = "Идентификатор варианта товара", example = "1")
    @NotNull
    private Long variantId;
    @Schema(description = "Количество товара", example = "2")
    @Min(1)
    @NotNull
    private Integer quantity;
}