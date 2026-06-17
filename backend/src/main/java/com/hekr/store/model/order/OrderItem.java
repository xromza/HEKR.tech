package com.hekr.store.model.order;

import jakarta.persistence.Entity;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.MapsId;

import java.math.BigDecimal;

import com.hekr.store.model.product.ProductVariant;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="order_items")
public class OrderItem{
    @EmbeddedId
    private OrderItemId id;
    @ManyToOne(fetch=FetchType.LAZY)
    @MapsId("orderId")
    @JoinColumn(name="order_id")
    private Order order;
    @ManyToOne(fetch=FetchType.LAZY)
    @MapsId("variantId")
    @JoinColumn(name="variant_id")
    private ProductVariant productVariant;
    @Column(name="quantity",nullable = false)
    private Integer quantity;
    @Column(name="price_at_purchase",nullable = false,precision =12,scale = 2)
    private BigDecimal priceAtPurchase;
    @Column(name="total_price",nullable = false,precision = 12,scale=2)
    private BigDecimal totalPrice;
}