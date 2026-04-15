package com.hekr.store.dto;

import java.math.BigDecimal;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Schema(
    description = "Информация о корзине пользователя",
    example = """
        {
          "items": [
            {
              "variantId": 22,
              "title": "Gucci slim jeans",
              "quantity": 3,
              "appliedPrice": 150.00,
              "subtotal": 450.00,
              "availableStock": 10,
              "priceType": "RETAIL",
              "imageUrl": "https://example.com/image.jpg"
            }
          ],
          "total_price": 450.00,
          "discount_applied": false,
          "can_checkout": true
        }
        """
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartResponseDto {
    @Schema(description = "Список товаров в корзине")
    private List<CartItemResponseDto> items;

    @Schema(description = "Общая стоимость корзины", example = "450.00")
    private BigDecimal total_price;
    @Schema(description = "Применены ли скидки к корзине", example = "false")
    private Boolean discount_applied;
    @Schema(description = "Возможно ли оформить заказ", example = "true")
    private Boolean can_checkout;
}
