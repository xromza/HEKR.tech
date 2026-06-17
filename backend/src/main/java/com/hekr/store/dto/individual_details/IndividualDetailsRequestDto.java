package com.hekr.store.dto.individual_details;

import java.time.LocalDate;


import com.hekr.store.interfaces.DetailsRequestInterface;
import com.hekr.store.utils.ClientType;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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
public class IndividualDetailsRequestDto implements DetailsRequestInterface {
    private ClientType type;
    @NotBlank
    @Schema(description = "Имя физического лица", example = "Иван")
    @Size(min = 1, max = 256, message="Имя не может быть больше 256 символов")
    @Pattern(regexp = "^[a-zA-Zа-яА-Я ]{1,256}$", message="Некорректное имя")
    private String firstName;

    @NotBlank
    @Schema(description = "Фамилия физического лица", example = "Петров")
    @Size(min = 1, max = 256, message="Фамилия не может быть больше 256 символов")
    @Pattern(regexp = "^[a-zA-Zа-яА-Я ]{1,256}$", message="Некорректная фамилия")
    private String lastName;

    @Schema(description = "Отчество физического лица", example = "Сергеевич")
    @Size(min = 1, max = 256, message="Отчество не может быть больше 256 символов")
    @Pattern(regexp = "^[a-zA-Zа-яА-Я]{0,256}$", message="Некорректное отчество")
    private String midName;

    @NotNull
    @Schema(description = "Дата рождения физического лица", example = "1990-05-15")
    @Past(message = "Дата рождения не может быть в будущем")
    private LocalDate birthDate;

    @NotBlank
    @Schema(description = "Серия паспорта", example = "1234")
    @Pattern(regexp = "^\\d{4}$", message = "Серия паспорта должна содержать 4 цифры")
    private String passportSeries;

    @NotBlank
    @Schema(description = "Номер паспорта", example = "567890")
    @Pattern(regexp = "^\\d{6}$", message = "Номер паспорта должен содержать 6 цифр")
    private String passportNumber;

}
