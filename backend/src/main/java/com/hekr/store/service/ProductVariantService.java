package com.hekr.store.service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hekr.store.dto.product.ProductVariantRequestDto;
import com.hekr.store.dto.product.ProductVariantResponseDto;
import com.hekr.store.exceptions.NotFoundException;
import com.hekr.store.mapper.product.ProductVariantMapper;
import com.hekr.store.model.product.Product;
import com.hekr.store.model.product.ProductVariant;
import com.hekr.store.repository.ProductVariantsRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductVariantService {
    private final ProductService productService;
    private final ProductVariantMapper productVariantMapper;
    private final ProductVariantsRepository productVariantsRepository;

    @Transactional
    public ProductVariantResponseDto createVariant(ProductVariantRequestDto dto, Long productId) {
        Product product = productService.getProductById(productId);

        ProductVariant productVariant = ProductVariant.builder()
                .color(dto.getColor())
                .images(Set.of())
                .sku(dto.getSku())
                .size(dto.getSize())
                .product(product)
                .stocks(Set.of())
                .isActive(true)
                .build();
        return productVariantMapper.toDto(productVariantsRepository.save(productVariant));
    }

    @Transactional(readOnly = true)
    public ProductVariant getProductVariantById(Long id) {
        return productVariantsRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Вариант товара не найден"));
    }

    @Transactional
    public Map<Long, ProductVariant> getAllVariantsByIds(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return Map.of();
        }

        List<ProductVariant> variants = productVariantsRepository.findAllVariantsByIds(ids);
        return variants.stream()
                .collect(Collectors.toMap(variant -> variant.getId(), variant -> variant));

    }

}
