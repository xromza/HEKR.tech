package com.hekr.store.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hekr.store.dto.header.HeaderResponseDto;
import com.hekr.store.utils.CategoryType;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HeaderService {
    private final ProductService productService;

    @Transactional(readOnly = true)
    public HeaderResponseDto getHeader() {
        return HeaderResponseDto.builder()
                .brandCount(productService.countBrands())
                .saleCount(productService.countWithSale())
                .manCount(productService.countByCategoryId(CategoryType.MEN.getId()))
                .womenCount(productService.countByCategoryId(CategoryType.WOMEN.getId()))
                .build();
    }
}
