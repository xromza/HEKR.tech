package com.hekr.store.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hekr.store.model.ProductVariant;


public interface ProductVariantsRepository extends JpaRepository<ProductVariant, Long> {
    @Query("SELECT DISTINCT pv FROM ProductVariant pv LEFT JOIN FETCH pv.images LEFT JOIN FETCH pv.stocks WHERE pv.id = :id AND pv.product.id = :productId")
    Optional<ProductVariant> findByIdWithImagesAndWithStock(@Param("id") Long id, @Param("productId") Long productId);

    @Query("SELECT DISTINCT pv FROM ProductVariant pv LEFT JOIN FETCH pv.images WHERE pv.product.id = :productId")
    List<ProductVariant> findByProductIdWithImages(Long productId);
    
}
