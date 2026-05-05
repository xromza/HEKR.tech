package com.hekr.store.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hekr.store.dto.header.HeaderResponseDto;
import com.hekr.store.service.HeaderService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/api/v1/header")
@RequiredArgsConstructor
public class HeaderController {
    private final HeaderService headerService;
    
    @GetMapping
    public ResponseEntity<HeaderResponseDto> getHeader() {
        return ResponseEntity.ok(headerService.getHeader());
    }
    
}
