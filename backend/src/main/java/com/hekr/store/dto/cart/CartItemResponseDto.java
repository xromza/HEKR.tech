package com.hekr.store.dto.cart;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Schema(
    description = "Информация о товаре в корзине",
    example = """
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
        """
)

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class CartItemResponseDto {
    @Schema(description = "Id варианта товара", example = "22")
    private Long variantId;
    private String brand;
    @Schema(description = "Название товара", example = "Gucci slim jeans")
    private String title;
    @Schema(description = "Количество товаров в корзине", example = "3")
    private Long quantity;
    @Schema(description = "Стоимость товара за штуку", example = "150.00")
    private BigDecimal appliedPrice;
    @Schema(description = "Общая цена", example = "450.00")
    private BigDecimal subtotal;
    @Schema(description = "Количество доступного товара", example = "10", nullable = true)
    private Integer availableStock;
    
    private String size;
    private String color;

    @Schema(description = "Тип применённой цены", example = "RETAIL")
    private String priceType;

    @Schema(description = "URL картинки товара", example = "https://example.com/image.jpg")
    private String imageUrl;
}