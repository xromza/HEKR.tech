package com.hekr.store.dto.auth;

import com.hekr.store.utils.UserRole;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDto {
    private String accessToken;
    private String refreshToken;
    @Builder.Default
    private String type = "Bearer";
    @Enumerated(EnumType.STRING)
    private UserRole role;
    private String description;
}
