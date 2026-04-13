package com.hekr.store.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Entity
@Table(name = "stock", schema = "public")
@IdClass(StockId.class)
@Getter 
@Setter
public class Stock {

    @Id
    @Column(name = "variant_id")
    private Long variantId;

    @Id
    @Column(name = "warehouse_id")
    private Long warehouseId;

    @Column(nullable = false)
    private Long quantity = 0L;

    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", insertable = false, updatable = false)
    private ProductVariant variant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", insertable = false, updatable = false)
    private Warehouse warehouse;
}

@EqualsAndHashCode
@Data
@NoArgsConstructor
@AllArgsConstructor
class StockId implements Serializable {
    private Long variantId;
    private Long warehouseId;
}