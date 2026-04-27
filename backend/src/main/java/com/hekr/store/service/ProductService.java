package com.hekr.store.service;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hekr.store.dto.product.ProductResponseDto;
import com.hekr.store.exceptions.NotFoundException;
import com.hekr.store.interfaces.ProductDtoInterface;
import com.hekr.store.mapper.product.ProductCatalogResponseMapper;
import com.hekr.store.mapper.product.ProductMapper;
import com.hekr.store.model.product.Product;
import com.hekr.store.model.product.ProductVariant;
import com.hekr.store.repository.ProductRepository;
import com.hekr.store.repository.ProductVariantsRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final ProductVariantsRepository productVariantsRepository;
    private final ProductCatalogResponseMapper productCatalogResponseMapper;

    @Transactional(readOnly = true)
    public Page<ProductDtoInterface> getProductCatalog(Pageable pageable) {

        return productRepository
                .findAllByIsActiveTrue(pageable)
                .map(productCatalogResponseMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<ProductDtoInterface> getVerboseProductCatalog(Pageable pageable) {

        return productRepository
                .findAllByIsActiveTrue(pageable)
                .map(productMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<ProductDtoInterface> findProductsByTitle(String query, Pageable pageable) {

        return productRepository
                .findByTitleContainingIgnoreCaseAndIsActiveTrue(query, pageable)
                .map(productCatalogResponseMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<ProductDtoInterface> findVerboseProductsByTitle(String query, Pageable pageable) {

        return productRepository
                .findByTitleContainingIgnoreCaseAndIsActiveTrue(query, pageable)
                .map(productMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public ProductResponseDto getProductDtoById(Long id) {
        Product product =productRepository
                .findById(id)
                .orElseThrow(
                        () -> new NotFoundException("Товар с id " + id + " не найден"));
                        product.getVariants().forEach(v -> v.getImages().size());
        return productMapper.toResponse(product);
    }

    @Transactional(readOnly = true)
    public ProductVariant getProductVariantById(Long id) {
        return productVariantsRepository.findById(id).orElseThrow(() -> new NotFoundException("Вариант товара не найден"));
    }
}
