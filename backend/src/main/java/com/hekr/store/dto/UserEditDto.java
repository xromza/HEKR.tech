package com.hekr.store.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Schema(
    description = "Запрос на редактирование пользователя",
    example = """
        {
            "login": "xromza",
            "role": "LEGAL",
            "password": "most_secure_password23@3",
            "isApproved": true,
            "companyName": "ООО ХЕКР БЛОК",
            "inn": "7707083892",
            "kpp": "773601001",
            "ogrn": "1027700132195",
            "legalAddress": "г. Санкт-Петербург ул. Хекровская д. 67",
            "phone": "+71860329353",
            "email": "ceo@hekr.tech",
            "firstName": null,
            "lastName": null,
            "midName": null,
            "birthDate": null,
            "passportSeries": null,
            "passportNumber": null
        }
        """
)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserEditDto {
    @NotBlank
    @Schema(description = "Логин пользователя", example = "xromza", accessMode = Schema.AccessMode.WRITE_ONLY)
    private String login;
    @NotBlank
    @Schema(description = "Пароль пользователя", example="most_secure_password23@3", accessMode = Schema.AccessMode.WRITE_ONLY)
    private String password;
    @NotBlank
    @Schema(description = "Роль пользователя", example="LEGAL", accessMode = Schema.AccessMode.WRITE_ONLY)
    private String role;

    @Size(max = 32)
    private String clientType;
    @NotBlank
    @Size(max = 20)
    private String phone;
    
    @Size(max=256)
    @NotBlank
    @Email
    private String email;

    @Schema(description = "Имя физического лица", example = "Иван", accessMode = Schema.AccessMode.READ_ONLY)
    private String firstName;

    @Schema(description = "Фамилия физического лица", example = "Петров", accessMode = Schema.AccessMode.READ_ONLY)
    private String lastName;

    @Schema(description = "Отчество физического лица", example = "Сергеевич", accessMode = Schema.AccessMode.READ_ONLY)
    private String midName;

    @Schema(description = "Дата рождения физического лица", example = "1990-05-15", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDate birthDate;

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
