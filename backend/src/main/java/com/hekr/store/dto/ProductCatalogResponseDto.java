package com.hekr.store.dto;

import java.math.BigDecimal;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductCatalogResponseDto implements ProductDtoInterface {
    @Schema(description = "Уникальный идентификатор продукта", example = "1")
    private Long id;
    
    @Schema(description = "Название товара", example = "Смартфон Samsung Galaxy A51")
    private String title;
    
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
    

    @Schema(description = "URL основного изображения товара", example = "https://example.com/images/product-1.jpg")
    private String mainImageUrl;
}
