package com.hekr.store.dto.user;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

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

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UserEditDto {
    @Schema(description = "Пароль пользователя", example="most_secure_password23@3", accessMode = Schema.AccessMode.WRITE_ONLY)
    private String password;

    @Size(max = 20)
    private String phone;
    
    @Size(max=256)
    @Email
    private String email;

    @JsonProperty("firstName")
    @Schema(description = "Имя физического лица", example = "Иван")
    private String firstName;

    @Schema(description = "Фамилия физического лица", example = "Петров")
    private String lastName;

    @Schema(description = "Отчество физического лица", example = "Сергеевич")
    private String midName;

    @Schema(description = "Дата рождения физического лица", example = "1990-05-15")
    private LocalDate birthDate;

    @Schema(description = "Название компании", example = "ООО ХЕКР БЛОК")
    private String companyName;

    @Schema(description = "ИНН", example = "7707083892")
    private String inn;

    @Schema(description = "КПП", example = "773601001")
    private String kpp;

    @Schema(description = "ОГРН", example = "1027700132195")
    private String ogrn;

    @Schema(description = "Юридический адрес", example = "г. Санкт-Петербург ул. Хекровская д. 67")
    private String legalAddress;
}
