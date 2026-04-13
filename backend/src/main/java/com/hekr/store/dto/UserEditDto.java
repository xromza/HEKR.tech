package com.hekr.store.dto;

import lombok.Getter;
import lombok.Setter;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserEditDto {
    @Schema(description = "Логин пользователя", example = "xromza", accessMode = Schema.AccessMode.WRITE_ONLY)
    private String login;
    
    @Schema(description = "Роль пользователя", example="LEGAL", accessMode = Schema.AccessMode.WRITE_ONLY)
    private String role;

    @Schema(description = "Пароль пользователя", example="most_secure_password23@3", accessMode = Schema.AccessMode.WRITE_ONLY)
    private String password;

    @Schema(description = "Активен ли пользователь", example = "true", accessMode = Schema.AccessMode.WRITE_ONLY)
    private Boolean isApproved;

    private LegalDetailsRequestDto legalDetails;
    private IndividualDetailsRequestDto individualDetails;
}
