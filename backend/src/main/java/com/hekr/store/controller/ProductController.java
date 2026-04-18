package com.hekr.store.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name="Каталог товаров", description="Работа с витриной и поиском")
public class ProductController {
    private final ProductRepository productRepository;
    @GetMapping("/products")
    public Page<Product> getMethodName(@RequestParam(required = false, defaultValue="0") Integer page,
        @RequestParam(required = false, defaultValue="10") Integer size,
        @RequestParam(required = false, defaultValue="id") String sort
 ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort));
        return productRepository.findAllByIsActiveTrue(pageable);
    }
    
}
