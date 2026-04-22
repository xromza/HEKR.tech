package com.hekr.store.controller;

import com.hekr.store.mapper.ProductCatalogResponseMapper;
import com.hekr.store.mapper.ProductCatalogResponseMapperImpl;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hekr.store.dto.ProductCatalogResponseDto;
import com.hekr.store.dto.ProductDtoInterface;
import com.hekr.store.dto.ProductResponseDto;
import com.hekr.store.mapper.ProductMapper;
import com.hekr.store.model.Product;
import com.hekr.store.repository.ProductRepository;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Tag(name = "Каталог товаров", description = "Работа с витриной и поиском")
public class ProductController {
    private final ProductRepository productRepository;
    private final ProductCatalogResponseMapper productCatalogResponseMapper;
    private final ProductMapper productMapper;

    @GetMapping("/catalog")
    public Page<ProductDtoInterface> getMethodName(@RequestParam(required = false, defaultValue = "0") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size,
            @RequestParam(required = false, defaultValue = "id") String sort,
            @RequestParam(required = false, defaultValue = "false") Boolean verbose) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort));
        Page<Product> productPage = productRepository.findAllByIsActiveTrue(pageable);
        if (verbose) {
            return productPage.map(productMapper::toResponse);
        }
        return productPage.map(productCatalogResponseMapper::toResponse);
    }
}
