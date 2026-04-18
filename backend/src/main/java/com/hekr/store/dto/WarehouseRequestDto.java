package com.hekr.store.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;



@Schema(
    description = "Запрос на создание склада",
    example = """
        {
          "address": "г. Москва ул. Складская 12/2"
        }
        """
)


@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WarehouseRequestDto {
    @NotBlank
    @Schema(description = "Адрес склада", example = "г. Москва ул. Складская 12/2")
    private String address;
}
