package com.hekr.store.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hekr.store.model.Stock;
import com.hekr.store.model.StockId;

public interface StockRepository extends JpaRepository<Stock, StockId> {
    @Query("SELECT s FROM Stock s LEFT JOIN s.variant WHERE s.id.variantId = :variantId")
    Page<Stock> findAllByVariantIdWithVariant(@Param("variantId") Long variantId, Pageable page);
    @Query("SELECT s FROM Stock s LEFT JOIN s.warehouse WHERE s.id.variantId = :variantId")
    Page<Stock> findAllByVariantIdWithWarehouse(@Param("variantId") Long variantId, Pageable page);
    @Query("SELECT s FROM Stock s LEFT JOIN s.variant WHERE s.id.warehouseId = :warehouseId")
    Page<Stock> findAllByWarehouseIdWithVariant(@Param("warehouseId") Long warehouseId, Pageable page);
    
}
