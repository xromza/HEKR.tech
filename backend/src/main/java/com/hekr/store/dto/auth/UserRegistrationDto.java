package com.hekr.store.dto.auth;

import java.time.LocalDate;

import com.hekr.store.utils.ClientType;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserRegistrationDto {
    @NotBlank
    @Schema(description = "Логин пользователя", example = "xromza")
    private String login;
    @NotBlank
    @Schema(description = "Пароль пользователя", example = "most_secure_password23@3")
    private String password;
    @NotBlank
    @Schema(description = "Роль пользователя", example = "CLIENT")
    private String role;

    @Size(max = 32)
    @Schema(description = "Тип клиента", example = "LEGAL")
    private ClientType clientType;
    @NotBlank
    @Size(max = 20)
    @Schema(description = "Номер телефона", example = "+7 (999) 123-45-67")
    private String phone;
    
    @Size(max=256)
    @NotBlank
    @Email
    @Schema(description = "Адрес электронной почты", example = "user@example.com")
    private String email;

    @Schema(description = "Имя физического лица", example = "Иван")
    private String firstName;

    @Schema(description = "Фамилия физического лица", example = "Петров")
    private String lastName;

    @Schema(description = "Отчество физического лица", example = "Сергеевич")
    private String midName;

    private String passportNumber;
    
    private String passportSeries;

    @Schema(description = "Дата рождения физического лица", example = "1990-05-15")
    private LocalDate birthDate;

    @Schema(description = "Название компании", example = "ООО ХЕКР БЛОК")
    private String companyName;

    @Schema(description = "ИНН компании", example = "7707083892")
    private String inn;

    @Schema(description = "КПП компании", example = "773601001")
    private String kpp;

    @Schema(description = "ОГРН компании", example = "1027700132195")
    private String ogrn;

    @Schema(description = "Юридический адрес компании", example = "г. Санкт-Петербург ул. Хекровская д. 67")
    private String legalAddress;
}
