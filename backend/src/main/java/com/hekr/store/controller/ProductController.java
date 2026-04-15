package com.hekr.store.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hekr.store.dto.ProductResponseDto;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/v1")
public class ProductController {
    @GetMapping("/test")
    public ProductResponseDto getMethodName(@RequestParam String param) {
        return new ProductResponseDto();
    }
    
}
