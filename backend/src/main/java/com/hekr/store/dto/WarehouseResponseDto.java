package com.hekr.store.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import io.swagger.v3.oas.annotations.media.Schema;



@Schema(
    description = "Информация о складе",
    example = """
        {
          "id": 12345,
          "address": "г. Москва ул. Складская 12/2"
        }
        """
)

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WarehouseResponseDto {
    @Schema(description = "Уникальный идентификатор склада", example = "12345", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;
    
    @Schema(description = "Адрес склада", example = "г. Москва ул. Складская 12/2")
    private String address;
}
