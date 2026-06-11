package com.hekr.store.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hekr.store.dto.header.HeaderResponseDto;
import com.hekr.store.repository.ProductRepository;
import com.hekr.store.utils.CategoryType;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HeaderService {
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public HeaderResponseDto getHeader() {
        return HeaderResponseDto.builder()
                .brandCount(productRepository.countDistinctBrands())
                .saleCount(productRepository.countProductWithSale())
                .manCount(productRepository.countProductsByCategoryId(CategoryType.MEN.getId()))
                .womenCount(productRepository.countProductsByCategoryId(CategoryType.WOMEN.getId()))
                .build();
    }
}
