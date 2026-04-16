package com.hekr.store.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    description = "Информация о запасах товара на складе",
    example = """
        {
          "variantId": 1,
          "warehouseId": 1,
          "address": "г. Москва ул. Складская 12/2",
          "quantity": 50
        }
        """
)

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockResponseDto {
    @Schema(description = "Идентификатор варианта товара", example = "1")
    private Long variantId;

    @Schema(description = "Идентификатор склада", example = "1")
    private Long warehouseId;
    
    @Schema(description = "Адрес склада", example = "г. Москва ул. Складская 12/2")
    private String address;

    @Schema(description = "Количество товара на складе", example = "50")
    @Builder.Default
    private Long quantity = 0L;
}
