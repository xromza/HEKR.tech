package com.hekr.store.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * DTO для представления информации о продукте в ответе API.
 * 
 * Содержит основные данные о товаре, включая цены оптовой и розничной торговли,
 * информацию о категории и варианты продукта.
 */
@Schema(
    description = "Информация о продукте",
    example = """
        {
          "id": 1,
          "title": "Худи Minimalism",
          "description": "Если бы у меня было такое худи, я был бы суперменом...",
          "categoryId": 5,
          "categoryName": "Худи и толстовки",
          "isActive": true,
          "priceWholesale": 15000.00,
          "priceRetail": 19999.99,
          "wholesaleThreshold": 10,
          "mainImageUrl": "https://example.com/images/product-1.jpg",
          "variants": [
            {
              "id": 1,
              "sku": "SKU-001",
              "color": "Черный",
              "size": "XL",
              "stock": 50
            }
          ]
        }
        """
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponseDto {
    
    @Schema(description = "Уникальный идентификатор продукта", example = "1")
    private Long id;
    
    @Schema(description = "Название товара", example = "Смартфон Samsung Galaxy A51")
    private String title;
    
    @Schema(description = "Подробное описание товара", example = "Современный смартфон с большим дисплеем и мощным процессором")
    private String description;
    
    @Schema(description = "ID категории товара", example = "5")
    private Long categoryId;
    
    @Schema(description = "Название категории товара", example = "Электроника")
    private String categoryName;
    
    @Schema(description = "Статус активности товара", example = "true")
    private Boolean isActive;
    
    @Schema(description = "Оптовая цена товара", example = "15000.00")
    private BigDecimal priceWholesale;
    
    @Schema(description = "Розничная цена товара", example = "19999.99")
    private BigDecimal priceRetail;
    
    @Schema(description = "Минимальное количество для оптовой цены", example = "10")
    private Integer wholesaleThreshold;
    
    @Schema(description = "Список вариантов продукта")
    private List<ProductVariantResponseDto> variants;

    @Schema(description = "URL основного изображения товара", example = "https://example.com/images/product-1.jpg")
    private String mainImageUrl;
}