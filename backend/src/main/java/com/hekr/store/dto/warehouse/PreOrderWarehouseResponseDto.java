package com.hekr.store.dto.warehouse;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PreOrderWarehouseResponseDto {
    @Schema(description = "Уникальный идентификатор склада", example = "12345", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;
    
    @Schema(description = "Адрес склада", example = "г. Москва ул. Складская 12/2")
    private String address;

    private boolean isAvailableForOrder;
}
