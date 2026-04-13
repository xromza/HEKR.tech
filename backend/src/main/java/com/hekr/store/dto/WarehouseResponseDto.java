package com.hekr.store.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import io.swagger.v3.oas.annotations.media.Schema;



@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class WarehouseResponseDto {
    @Schema(description = "Уникальный идентификатор товара", example = "12345", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;
    
    @Schema(description = "Адрес склада", example = "г. Москва ул. Складская 12/2")
    private String address;
}
