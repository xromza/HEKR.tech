package com.hekr.store.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hekr.store.dto.auth.AuthRequestDto;
import com.hekr.store.dto.auth.AuthResponseDto;
import com.hekr.store.dto.auth.AuthResult;
import com.hekr.store.dto.auth.UserRegistrationDto;
import com.hekr.store.dto.status.StatusDto;
import com.hekr.store.service.AuthService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;

import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody AuthRequestDto request) {
        AuthResult result = authService.authenticate(request);

        ResponseCookie cookie = ResponseCookie.from("refreshToken", result.getRefreshToken().getToken())
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(result.getRefreshTokenDuration())
                .sameSite("Lax")
                .build();

        return ResponseEntity
                .ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(result.getAuthResponseDto());
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(@Valid @RequestBody UserRegistrationDto request) {
        
        AuthResult result = authService.register(request);

        ResponseCookie cookie = ResponseCookie.from("refreshToken", result.getRefreshToken().getToken())
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(result.getRefreshTokenDuration())
                .sameSite("Lax")
                .build();

        return ResponseEntity
                .ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(result.getAuthResponseDto());
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponseDto> refresh(@NonNull HttpServletRequest request) {
        String refreshToken = extractValue(request, "refreshToken");

        if (refreshToken == null) {
            throw new BadCredentialsException("Отсутствует токен");
        }

        AuthResult result = authService.refreshAccessToken(refreshToken);

        return ResponseEntity.ok(result.getAuthResponseDto());
    }

    @PostMapping("/logout")
    public ResponseEntity<StatusDto> logout(@NonNull HttpServletRequest request) {
        String refreshToken = extractValue(request, "refreshToken");

        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .build();
        return ResponseEntity
                .ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(authService.logout(refreshToken));
    }

    private String extractValue(HttpServletRequest request, String key) {
        Cookie[] cookies = request.getCookies();
        String res = null;

        if (cookies != null) {
            res = Arrays
                    .stream(cookies)
                    .filter(cookie -> key.equals(cookie.getName()))
                    .map(Cookie::getValue)
                    .findFirst()
                    .orElse(null);
        }

        return res;
    }

}
