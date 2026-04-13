package com.hekr.store.dto;

import lombok.Getter;
import lombok.Setter;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserRegistrationDto {
    @NotBlank
    @Schema(description = "Логин пользователя", example = "xromza", accessMode = Schema.AccessMode.WRITE_ONLY)
    private String login;
    @NotBlank
    @Schema(description = "Пароль пользователя", example="most_secure_password23@3", accessMode = Schema.AccessMode.WRITE_ONLY)
    private String password;
    @NotBlank
    @Schema(description = "Роль пользователя", example="LEGAL", accessMode = Schema.AccessMode.WRITE_ONLY)
    private String role;

    private LegalDetailsRequestDto legalDetails;
    private IndividualDetailsRequestDto individualDetails;
}
