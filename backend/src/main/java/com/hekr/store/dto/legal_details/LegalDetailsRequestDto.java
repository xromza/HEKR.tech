package com.hekr.store.dto.legal_details;

import com.hekr.store.interfaces.DetailsRequestInterface;
import com.hekr.store.utils.ClientType;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Schema(description = "Юридические детали компании для запроса", example = """
        {
          "companyName": "ООО ХЕКР БЛОК",
          "inn": "7707083892",
          "kpp": "773601001",
          "ogrn": "1027700132195",
          "legalAddress": "г. Санкт-Петербург ул. Хекровская д. 67"
        }
        """)
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LegalDetailsRequestDto implements DetailsRequestInterface {
    private ClientType type;
    @NotBlank
    @Schema(description = "Название компании", example = "ООО ХЕКР БЛОК")
    @Size(max = 256)
    private String companyName;

    @NotBlank
    @Size(min = 12, max = 12)
    @Schema(description = "ИНН компании", example = "7707083892")
    private String inn;

    @NotBlank
    @Size(min = 9, max = 9)
    @Schema(description = "КПП компании", example = "773601001")
    private String kpp;

    @NotBlank
    @Schema(description = "ОГРН компании", example = "1027700132195")
    @Size(min = 13, max = 13)
    private String ogrn;

    @NotBlank
    @Size(max = 256)
    @Schema(description = "Юридический адрес компании", example = "г. Санкт-Петербург ул. Хекровская д. 67")
    private String legalAddress;
}
