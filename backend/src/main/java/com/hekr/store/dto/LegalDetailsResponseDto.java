package com.hekr.store.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Schema(
    description = "Юридические детали компании в ответе",
    example = """
        {
          "companyName": "ООО ХЕКР БЛОК",
          "inn": "7707083892",
          "kpp": "773601001",
          "ogrn": "1027700132195",
          "legalAddress": "г. Санкт-Петербург ул. Хекровская д. 67"
        }
        """
)
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LegalDetailsResponseDto {

    @Schema(description = "Название компании", example = "ООО ХЕКР БЛОК", accessMode = Schema.AccessMode.READ_ONLY)
    private String companyName;

    @Schema(description = "ИНН компании", example = "7707083892", accessMode = Schema.AccessMode.READ_ONLY)
    private String inn;

    @Schema(description = "КПП компании", example = "773601001", accessMode = Schema.AccessMode.READ_ONLY)
    private String kpp;

    @Schema(description = "ОГРН компании", example = "1027700132195", accessMode = Schema.AccessMode.READ_ONLY)
    private String ogrn;

    @Schema(description = "Юридический адрес компании", example = "г. Санкт-Петербург ул. Хекровская д. 67", accessMode = Schema.AccessMode.READ_ONLY)
    private String legalAddress;
}
