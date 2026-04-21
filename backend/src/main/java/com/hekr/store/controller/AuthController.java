package com.hekr.store.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hekr.store.auth.AuthRequestDto;
import com.hekr.store.auth.AuthResponseDto;
import com.hekr.store.auth.UserRegistrationDto;
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
    public ResponseEntity<?> login(@RequestBody AuthRequestDto request) {
        try {
        return ResponseEntity.ok(authService.authenticate(request));
        } catch (Exception e) {
            e.printStackTrace(); // Смотрим, что упало на самом деле
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(@RequestBody UserRegistrationDto request) {
        return ResponseEntity.ok(authService.register(request));
    }
    
}
