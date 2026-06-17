package com.hekr.store.dto.warehouse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
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
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class WarehouseResponseDto {
    @Schema(description = "Уникальный идентификатор склада", example = "12345", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;
    
    @Schema(description = "Адрес склада", example = "г. Москва ул. Складская 12/2")
    private String address;
}
