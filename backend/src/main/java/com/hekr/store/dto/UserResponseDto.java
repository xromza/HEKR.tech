package com.hekr.store.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Schema(
    description = "Информация о пользователе",
    example = """
        {
          "id": 1,
          "login": "xromza",
          "role": "CLIENT",
          "createdAt": "2026-04-13T14:00:03",
          "isApproved": true,
          "clientType": "LEGAL",
          "firstName": null,
          "lastName": null,
          "midName": null,
          "birthDate": null,
          "phone": "+7 (999) 123-45-67",
          "email": "ivan.petrov@example.ru",
          "companyName": "ООО ХЕКР БЛОК",
          "inn": "7707083892",
          "kpp": "773601001",
          "ogrn": "1027700132195",
          "legalAddress": "г. Санкт-Петербург ул. Хекровская д. 67"
        }
        """
)

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDto {

    @Schema(description = "Уникальный идентификатор пользователя", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @Schema(description = "Логин пользователя", example = "xromza", accessMode = Schema.AccessMode.READ_ONLY)
    private String login;
    @Schema(description = "Роль пользователя", example = "LEGAL", accessMode = Schema.AccessMode.READ_ONLY)
    private String role;
    @Schema(description = "Время создания аккаунта", example = "2026-04-13T14:00:03", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime createdAt;
    @Schema(description = "Активен ли аккаунт", example = "true", accessMode = Schema.AccessMode.READ_ONLY)
    private Boolean isApproved;

    @Schema(description = "Тип клиента", example = "COMPANY", accessMode = Schema.AccessMode.READ_ONLY)
    private String clientType;

    @Schema(description = "Имя физического лица", example = "Иван", accessMode = Schema.AccessMode.READ_ONLY)
    private String firstName;

    @Schema(description = "Фамилия физического лица", example = "Петров", accessMode = Schema.AccessMode.READ_ONLY)
    private String lastName;

    @Schema(description = "Отчество физического лица", example = "Сергеевич", accessMode = Schema.AccessMode.READ_ONLY)
    private String midName;

    @Schema(description = "Дата рождения физического лица", example = "1990-05-15", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDate birthDate;

    @Schema(description = "Номер телефона", example = "+7 (999) 123-45-67", accessMode = Schema.AccessMode.READ_ONLY)
    private String phone;

    @Schema(description = "Адрес электронной почты", example = "ivan.petrov@example.ru", accessMode = Schema.AccessMode.READ_ONLY)
    private String email;

    @Schema(description = "Название компании", example = "ООО ХЕКР БЛОК", accessMode = Schema.AccessMode.READ_ONLY)
    private String companyName;

    @Schema(description = "ИНН компании", example = "7707083892", accessMode = Schema.AccessMode.READ_ONLY)
    private String inn;

    @Schema(description = "КПП компании", example = "773601001", accessMode = Schema.AccessMode.READ_ONLY)
    private String kpp;

    @Schema(description = "ОГРН компании", example = "1027700132195", accessMode = Schema.AccessMode.READ_ONLY)
    private String ogrn;

    @Schema(description = "Юридический адрес компании", example = "г. Санкт-Петербург ул. Хекровская д. 67", accessMode = Schema.AccessMode.READ_ONLY)
    private String legalAddress;
}
