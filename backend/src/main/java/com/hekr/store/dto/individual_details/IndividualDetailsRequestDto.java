package com.hekr.store.dto.individual_details;

import java.time.LocalDate;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Schema(
    description = "Детали физического лица для запроса",
    example = """
        {
          "firstName": "Иван",
          "lastName": "Петров",
          "midName": "Сергеевич",
          "birthDate": "1990-05-15",
          "passportSeries": "1234",
          "passportNumber": "567890"
        }
        """
)

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class IndividualDetailsRequestDto {
    @NotBlank
    @Schema(description = "Имя физического лица", example = "Иван")
    private String firstName;

    @NotBlank
    @Schema(description = "Фамилия физического лица", example = "Петров")
    private String lastName;

    @Schema(description = "Отчество физического лица", example = "Сергеевич")
    private String midName;

    @NotBlank
    @Schema(description = "Дата рождения физического лица", example = "1990-05-15")
    private LocalDate birthDate;

    @NotBlank
    @Schema(description = "Серия паспорта", example = "1234")
    private String passportSeries;

    @NotBlank
    @Schema(description = "Номер паспорта", example = "567890")
    private String passportNumber;

}
