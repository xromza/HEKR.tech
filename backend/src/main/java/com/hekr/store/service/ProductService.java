package com.hekr.store.service;

import org.springframework.data.domain.Pageable;

import java.util.ArrayList;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hekr.store.dto.product.ProductRequestDto;
import com.hekr.store.dto.product.ProductResponseDto;
import com.hekr.store.exceptions.NotFoundException;
import com.hekr.store.interfaces.ProductDtoInterface;
import com.hekr.store.mapper.product.ProductCatalogResponseMapper;
import com.hekr.store.mapper.product.ProductMapper;
import com.hekr.store.model.category.Category;
import com.hekr.store.model.product.Product;
import com.hekr.store.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final ProductCatalogResponseMapper productCatalogResponseMapper;
    private final CategoryService categoryService;


    @Transactional(readOnly = true)
    public Page<ProductDtoInterface> getProductCatalog(Pageable pageable) {

        return productRepository
                .findAllByIsActiveTrue(pageable)
                .map(productCatalogResponseMapper::toResponse);
    }

    public Page<ProductDtoInterface> getVerboseProductCatalog(Pageable pageable) {

        return productRepository
                .findAllByIsActiveTrue(pageable)
                .map(productMapper::toResponse);
    }

    public Page<ProductDtoInterface> getProductCatalogByCategoryId(Pageable pageable, Long categoryId) {
        return productRepository
                .findAllActiveByIdCategoryId(categoryId, pageable)
                .map(productCatalogResponseMapper::toResponse);
    }

    public Page<ProductDtoInterface> getVerboseProductCatalogByCategoryId(Pageable pageable, Long categoryId) {
        Page<Product> productPage = productRepository.findAllActiveByIdCategoryId(categoryId, pageable);

        return productPage.map(productMapper::toResponse);
    }

    public Page<ProductDtoInterface> findProductsByTitle(String query, Pageable pageable) {

        return productRepository
                .findByTitleContainingIgnoreCaseAndIsActiveTrue(query, pageable)
                .map(productCatalogResponseMapper::toResponse);
    }

    public Page<ProductDtoInterface> findVerboseProductsByTitle(String query, Pageable pageable) {

        return productRepository
                .findByTitleContainingIgnoreCaseAndIsActiveTrue(query, pageable)
                .map(productMapper::toResponse);
    }

    public ProductResponseDto getProductDtoById(Long id) {
        Product product = productRepository
                .findByIdWithVariantsAndImages(id)
                .orElseThrow(
                        () -> new NotFoundException("Товар с id " + id + " не найден"));
        return productMapper.toResponse(product);
    }

    public Product getProductById(Long id) {
        Product product = productRepository
                .findByIdWithVariantsAndImages(id)
                .orElseThrow(
                        () -> new NotFoundException("Товар с id " + id + " не найден"));
        return product;
    }

    @Transactional
    public ProductResponseDto createProduct(ProductRequestDto dto) {
        Category category = categoryService.getCategoryById(dto.getCategoryId());
        Product product = Product.builder()
                .brand(dto.getBrand())
                .category(category)
                .description(dto.getDescription())
                .isActive(true)
                .priceRetail(dto.getPriceRetail())
                .priceWholesale(dto.getPriceWholesale())
                .title(dto.getTitle())
                .variants(new ArrayList<>())
                .wholesaleThreshold(dto.getWholesaleThreshold())
                .build();
        return productMapper.toResponse(productRepository.save(product));
    }

    @Transactional(readOnly = true)
    public Long countByCategoryId(Long categoryId) {
        return productRepository.countProductsByCategoryId(categoryId);
    }

    public Long countWithSale() {
        return productRepository.countProductWithSale();
    }

    public Long countBrands() {
        return productRepository.countDistinctBrands();
    }

}
