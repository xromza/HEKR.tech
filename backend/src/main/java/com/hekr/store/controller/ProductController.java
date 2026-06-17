package com.hekr.store.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hekr.store.dto.product.ProductResponseDto;
import com.hekr.store.interfaces.ProductDtoInterface;
import com.hekr.store.service.ProductService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Tag(name = "Каталог товаров", description = "Работа с витриной и поиском")
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public Page<ProductDtoInterface> getProducts(
            Pageable pageable,
            @RequestParam(required = false, defaultValue = "false") boolean verbose) {
        if (verbose) {
            return productService.getVerboseProductCatalog(pageable);
        }
        return productService.getProductCatalog(pageable);
    }

    @GetMapping("/category/{id}")
    public Page<ProductDtoInterface> getProductsOfCategory(
            Pageable pageable,
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "false") boolean verbose) {
        if (verbose) {
            return productService.getVerboseProductCatalogByCategoryId(pageable, id);
        }
        return productService.getProductCatalogByCategoryId(pageable, id);
    }

    @GetMapping("/search")
    public Page<ProductDtoInterface> searchProductsByTitle(
            @RequestParam(required = true, defaultValue = "") String query,
            Pageable pageable,
            @RequestParam(required = false, defaultValue = "false") Boolean verbose) {
        if (verbose) {
            return productService.findVerboseProductsByTitle(query, pageable);
        }
        return productService.findProductsByTitle(query, pageable);
    }

    @GetMapping("/{id}")
    public ProductResponseDto getProduct(@PathVariable Long id) {
        return productService.getProductDtoById(id);
    }

}
