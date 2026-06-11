package com.hekr.store.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hekr.store.model.stock.Stock;
import com.hekr.store.model.stock.StockId;

public interface StockRepository extends JpaRepository<Stock, StockId> {
    
    @Query("SELECT s FROM Stock s LEFT JOIN FETCH s.variant WHERE s.id.variantId = :variantId")
    List<Stock> findAllByVariantIdWithVariant(@Param("variantId") Long variantId);
    @Query("SELECT s FROM Stock s LEFT JOIN FETCH s.warehouse WHERE s.id.variantId = :variantId")
    List<Stock> findAllByVariantIdWithWarehouse(@Param("variantId") Long variantId);
    @Query("SELECT s FROM Stock s LEFT JOIN FETCH s.variant WHERE s.id.warehouseId = :warehouseId")
    List<Stock> findAllByWarehouseIdWithVariant(@Param("warehouseId") Long warehouseId);
    @Query("SELECT s FROM Stock s WHERE s.id.variantId = :variantId")
    List<Stock> findAllByVariantId(@Param("variantId") Long variantId);
    @Query("SELECT s FROM Stock s WHERE s.id.warehouseId = :warehouseId")
    List<Stock> findAllByWarehouseId(@Param("warehouseId") Long warehouseId);
    @Query("SELECT s FROM Stock s WHERE s.id.warehouseId = :warehouseId AND s.id.variantId IN :variantIds")
    List<Stock> findAllByWarehouseIdAndVariantIdsIn(@Param("warehouseId") Long warehouseId, @Param("variantIds") List<Long> variantIds);

}
