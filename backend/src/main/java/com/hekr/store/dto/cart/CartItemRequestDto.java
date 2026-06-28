package com.hekr.store.dto.cart;

import com.hekr.store.interfaces.ItemRequestInterface;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
@Schema(
    description = "Запрос на добавление товара в корзину",
    example = """
        {
          "variantId": 3,
          "quantity": 3
        }
        """
)
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class CartItemRequestDto implements ItemRequestInterface {
    @Schema(description = "Id варианта товара", example = "3")
    @NotNull
    private Long variantId;
    @Schema(description = "Количество товара", example = "3")
    @NotNull
    @Min(1)
    private Integer quantity;

}