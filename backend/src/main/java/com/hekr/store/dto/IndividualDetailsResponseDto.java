package com.hekr.store.dto;

import java.time.LocalDate;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
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

    @Schema(description = "Номер телефона физического лица", example = "+7 (999) 123-45-67", accessMode = Schema.AccessMode.READ_ONLY)
    private String phone;

    @Schema(description = "Адрес электронной почты физического лица", example = "ivan.petrov@example.ru", accessMode = Schema.AccessMode.READ_ONLY)
    private String email;

}
