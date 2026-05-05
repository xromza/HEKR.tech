package com.hekr.store.service;

import org.springframework.stereotype.Service;

import com.hekr.store.dto.header.HeaderResponseDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HeaderService {
    private final ProductService productService;

    public HeaderResponseDto getHeader() {
        return HeaderResponseDto.builder()
                .brandCount(productService.countBrands())
                .saleCount(productService.countWithSale())
                .manCount(productService.countByCategoryId(1L))
                .womenCount(productService.countByCategoryId(2L))
                .build();
    }

}
