package com.hekr.store.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LegalDetailsRequestDto {

    @NotBlank
    @Schema(description = "Название компании", example = "ООО ХЕКР БЛОК", accessMode = Schema.AccessMode.WRITE_ONLY)
    private String companyName;
    
    @NotBlank
    @Size(max=12)
    @Schema(description = "ИНН", example = "7707083892", accessMode = Schema.AccessMode.WRITE_ONLY)
    private String inn;

    @NotBlank
    @Schema(description = "КПП", example = "773601001", accessMode = Schema.AccessMode.WRITE_ONLY)
    private String kpp;

    @NotBlank
    @Schema(description = "ОГРН", example = "1027700132195", accessMode = Schema.AccessMode.WRITE_ONLY)
    private String ogrn;

    @NotBlank
    @Schema(description = "Юридический адрес", example = "г. Санкт-Петербург ул. Хекровская д. 67", accessMode = Schema.AccessMode.WRITE_ONLY)
    private String legalAddress;
}
