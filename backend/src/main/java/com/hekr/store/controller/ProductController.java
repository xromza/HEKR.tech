package com.hekr.store.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hekr.store.dto.product.ProductResponseDto;
import com.hekr.store.interfaces.ProductDtoInterface;
import com.hekr.store.service.ProductService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
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
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "id") String sort,
            @RequestParam(required = false, defaultValue = "false") boolean verbose) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort));
        if (verbose) {
            return productService.getVerboseProductCatalog(pageable);
        }
        return productService.getProductCatalog(pageable);
    }

    @GetMapping("/search")
    public Page<ProductDtoInterface> searchProductsByTitle(
            @RequestParam(required = true, defaultValue = "") String query,
            @RequestParam(required = false, defaultValue = "0") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size,
            @RequestParam(required = false, defaultValue = "id") String sort,
            @RequestParam(required = false, defaultValue = "false") Boolean verbose) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort));
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
