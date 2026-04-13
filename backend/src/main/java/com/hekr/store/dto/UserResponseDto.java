package com.hekr.store.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDto {
    @Schema(description = "Логин пользователя", example = "xromza", accessMode = Schema.AccessMode.READ_ONLY)
    private String login;
    @Schema(description = "Роль пользователя", example="LEGAL", accessMode = Schema.AccessMode.READ_ONLY)
    private String role;
    @Schema(description = "Время создания аккаунта", example="2026.04.13 14:00:03", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime createdAt;
    @Schema(description = "Активен ли аккаунт", example = "true", accessMode = Schema.AccessMode.READ_ONLY)
    private Boolean isApproved;
}
