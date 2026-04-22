package com.hekr.store.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hekr.store.dto.auth.AuthRefreshRequestDto;
import com.hekr.store.dto.auth.AuthRequestDto;
import com.hekr.store.dto.auth.AuthResponseDto;
import com.hekr.store.dto.auth.UserRegistrationDto;
import com.hekr.store.dto.status.StatusDto;
import com.hekr.store.service.AuthService;


import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody AuthRequestDto request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(@RequestBody UserRegistrationDto request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponseDto> refresh(@RequestBody AuthRefreshRequestDto request) {
        return ResponseEntity.ok(authService.refreshAccessToken(request));
    }
    @PostMapping("/logout")
    public ResponseEntity<StatusDto> logout(@RequestBody AuthRefreshRequestDto request) {
        return ResponseEntity.ok(authService.logout(request));
    }
}
