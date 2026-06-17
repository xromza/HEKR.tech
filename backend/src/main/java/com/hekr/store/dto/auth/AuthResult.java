package com.hekr.store.dto.auth;

import com.hekr.store.model.user.UserToken;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class AuthResult {
    private AuthResponseDto authResponseDto;
    private UserToken refreshToken;
    private String accessToken;
    private long refreshTokenDuration;
}
