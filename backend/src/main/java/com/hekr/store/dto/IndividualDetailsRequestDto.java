package com.hekr.store.dto;

import java.time.LocalDate;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class IndividualDetailsRequestDto {
    @NotBlank
    @Schema(description = "Имя физического лица", example = "Иван", accessMode = Schema.AccessMode.READ_ONLY)
    private String firstName;

    @NotBlank
    @Schema(description = "Фамилия физического лица", example = "Петров", accessMode = Schema.AccessMode.READ_ONLY)
    private String lastName;

    @Schema(description = "Отчество физического лица", example = "Сергеевич", accessMode = Schema.AccessMode.READ_ONLY)
    private String midName;

    @NotBlank
    @Schema(description = "Дата рождения физического лица", example = "1990-05-15", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDate birthDate;

    @NotBlank
    @Schema(description = "Номер телефона физического лица", example = "+7 (999) 123-45-67", accessMode = Schema.AccessMode.READ_ONLY)
    private String phone;
    
    @NotBlank
    @Schema(description = "Адрес электронной почты физического лица", example = "ivan.petrov@example.ru", accessMode = Schema.AccessMode.READ_ONLY)
    private String email;

    @NotBlank
    @Schema(description = "Серия паспорта физического лица", example = "ivan.petrov@example.ru", accessMode = Schema.AccessMode.READ_ONLY)
    private String passport_series;

    @NotBlank
    @Schema(description = "Номер паспорта физического лица", example = "ivan.petrov@example.ru", accessMode = Schema.AccessMode.READ_ONLY)
    private String passport_number;

}
