package com.hekr.store.dto.individual_details;

import java.time.LocalDate;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Schema(
    description = "Детали физического лица в ответе",
    example = """
        {
          "firstName": "Иван",
          "lastName": "Петров",
          "midName": "Сергеевич",
          "birthDate": "1990-05-15"
        }
        """
)

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class IndividualDetailsResponseDto {
    @Schema(description = "Имя физического лица", example = "Иван", accessMode = Schema.AccessMode.READ_ONLY)
    private String firstName;

    @Schema(description = "Фамилия физического лица", example = "Петров", accessMode = Schema.AccessMode.READ_ONLY)
    private String lastName;

    @Schema(description = "Отчество физического лица", example = "Сергеевич", accessMode = Schema.AccessMode.READ_ONLY)
    private String midName;

    @Schema(description = "Дата рождения физического лица", example = "1990-05-15", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDate birthDate;

}
