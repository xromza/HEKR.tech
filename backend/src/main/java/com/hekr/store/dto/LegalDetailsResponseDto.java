package com.hekr.store.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LegalDetailsResponseDto {

    @Schema(description = "Название компании", example = "ООО ХЕКР БЛОК", accessMode = Schema.AccessMode.READ_ONLY)
    private String companyName;

    @Schema(description = "ИНН", example = "7707083892", accessMode = Schema.AccessMode.READ_ONLY)
    private String inn;

    @Schema(description = "КПП", example = "773601001", accessMode = Schema.AccessMode.READ_ONLY)
    private String kpp;

    @Schema(description = "ОГРН", example = "1027700132195", accessMode = Schema.AccessMode.READ_ONLY)
    private String ogrn;

    @Schema(description = "Юридический адрес", example = "г. Санкт-Петербург ул. Хекровская д. 67")
    private String legalAddress;
}
