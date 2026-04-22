package com.hekr.store.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    description = "Информация о варианте продукта",
    example = """
        {
          "id": 1,
          "productId": 10,
          "sku": "SKU-001",
          "size": "M",
          "color": "Черный",
          "stock": [
            {
              "variantId": 1,
              "warehouseId": 1,
              "address": "г. Москва ул. Складская 12/2",
              "quantity": 50
            }
          ],
          "isActive": true,
          "images": [
            {
              "id": 1,
              "url": "https://example.com/image1.jpg",
              "type": "MAIN",
              "sortOrder": 1,
              "createdAt": "2023-01-01T00:00:00"
            }
          ]
        }
        """
)
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantResponseDto {
    @Schema(description = "Уникальный идентификатор варианта продукта", example = "1")
    private Long id;
    @Schema(description = "Идентификатор продукта", example = "10")
    private Long productId;
    @Schema(description = "Артикул варианта", example = "SKU-001")
    private String sku;
    @Schema(description = "Размер варианта", example = "M")
    private String size;
    @Schema(description = "Цвет варианта", example = "Черный")
    private String color;
    @Schema(description = "Вес товара в кг", example = "1")
    private BigDecimal weight;
    @Schema(description = "Информация о запасах на складах")
    private List<StockResponseDto> stock;
    @Schema(description = "Активен ли вариант", example = "true")
    private Boolean isActive;
    @Schema(description = "Список изображений варианта")
    private List<ImagesDto> images;
}