package com.hekr.store.dto.auth;


import com.hekr.store.interfaces.DetailsRequestInterface;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
    @Size(max = 20)
    @Schema(description = "Номер телефона", example = "+7 (999) 123-45-67")
    private String phone;
    
    @Size(max=256)
    @NotBlank
    @Email
    @Schema(description = "Адрес электронной почты", example = "user@example.com")
    private String email;


    @NotNull
    @Valid
    private DetailsRequestInterface details;
}
