package com.hekr.store.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

/**
 * DTO для представления информации о товаре в заказе в ответе API.
 * 
 * Содержит полную информацию о товаре, включая его характеристики,
 * цену, количество и доступность на складе.
 * 
 * @schema OrderItemResponseDto
 * @description Информация о товаре в составе заказа
 */
@Schema(
    description = "Информация о товаре в составе заказа",
    example = """
        {
          "productId": 1,
          "variantId": 101,
          "title": "Футболка классическая",
          "sku": "TSH-001-BL-M",
          "size": "M",
          "color": "Синий",
          "mainImageUrl": "https://storage.example.com/products/tsh-001-blue.jpg",
          "quantity": 2,
          "appliedPrice": 599.99,
          "subtotal": 1199.98,
          "availableStock": 15
        }
        """
)
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemResponseDto {
    @Schema(description = "Уникальный идентификатор товара")
    private Long productId;
    
    @Schema(description = "Уникальный идентификатор варианта товара")
    private Long variantId;
    
    @Schema(description = "Название товара", example = "Футболка классическая")
    private String title;
    
    @Schema(description = "Артикул товара", example = "TSH-001-BL-M")
    private String sku;
    
    @Schema(description = "Размер товара", example = "M")
    private String size;
    
    @Schema(description = "Цвет товара", example = "Синий")
    private String color;
    
    @Schema(description = "URL основного изображения товара", example = "https://storage.example.com/products/tsh-001-blue.jpg")
    private String mainImageUrl;
    
    @Schema(description = "Количество товара в заказе", example = "2")
    private Long quantity;
    
    @Schema(description = "Цена за единицу товара с применёнными скидками", example = "599.99")
    private BigDecimal appliedPrice;
    
    @Schema(description = "Итоговая стоимость товара (quantity × appliedPrice)", example = "1199.98")
    private BigDecimal subtotal;
    
    @Schema(description = "Количество товара в наличии", example = "15")
    private Integer availableStock;
}