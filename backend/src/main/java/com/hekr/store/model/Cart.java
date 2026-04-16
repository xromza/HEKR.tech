package com.hekr.store.model;

import jakarta.persistence.Entity;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.FetchType;
import jakarta.persistence.MapsId;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Column;

@Entity
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="carts")
public class Cart {
    @EmbeddedId
    private CartItemId id;
    @ManyToOne(fetch=FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name="user_id")
    private User user;
    @ManyToOne(fetch= FetchType.LAZY)
    @MapsId("variantId")
    @JoinColumn(name="variant_id")
    private ProductVariant productVariant;
    @Column(nullable = false)
    private Long quantity;
}