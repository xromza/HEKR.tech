package com.hekr.store.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hekr.store.model.product.Product;

public interface ProductRepository  extends JpaRepository<Product, Long> {
    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.variants WHERE p.id = :id")
    Optional<Product> findByIdWithVariants(Long id);


    Page<Product> findAllByIsActiveTrue(Pageable pageable);

    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN p.variants WHERE p.isActive = true")
    Page<Product> findAllActiveWithVariants(Pageable pageable);

    Page<Product> findByTitleContainingIgnoreCaseAndIsActiveTrue(String title, Pageable pageable);
    Page<Product> findByTitleContainingIgnoreCase(String title, Pageable pageable);


}
