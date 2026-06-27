package com.hekr.store.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hekr.store.model.product.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN FETCH p.variants v LEFT JOIN FETCH v.images WHERE p.id = :id")
    Optional<Product> findByIdWithVariantsAndImages(@Param("id") Long id);

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.variants WHERE p.id = :id")
    Optional<Product> findByIdWithVariants(Long id);

    Page<Product> findAllByIsActiveTrue(Pageable pageable);

    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN p.variants WHERE p.isActive = true")
    Page<Product> findAllActiveWithVariants(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.category.id = :categoryId")
    Page<Product> findAllActiveByIdCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);

    @EntityGraph(attributePaths = { "variants" })
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.category.id = :categoryId")
    Page<Product> findAllActiveByIdCategoryIdVerbose(@Param("categoryId") Long categoryId, Pageable pageable);

    Page<Product> findByTitleContainingIgnoreCaseAndIsActiveTrue(String title, Pageable pageable);

    Page<Product> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    @Query("SELECT COUNT(p) FROM Product p WHERE p.category.id = :id")
    Long countProductsByCategoryId(@Param("id") Long id);

    @Query("SELECT COUNT(p) FROM Product p " +
            "WHERE p.category.discount IS NOT NULL")
    Long countProductWithSale();

}
