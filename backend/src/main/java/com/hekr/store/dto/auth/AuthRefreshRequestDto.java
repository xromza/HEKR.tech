package com.hekr.store.dto.auth;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@RequiredArgsConstructor
@Getter
@Setter
public class AuthRefreshRequestDto {
    private String refreshToken;
}
