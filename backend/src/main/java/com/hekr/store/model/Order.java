package com.hekr.store.model;

import com.hekr.store.utils.PaymentMethod;
import com.hekr.store.utils.Status;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "orders")

public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id")
    private Warehouse warehouse;
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String address;
    @Column(nullable = false, length = 32)
    @Enumerated(EnumType.STRING)
    private Status status;
    @Column(name = "payment_method", nullable = false, length = 32)
    @Enumerated(EnumType.STRING)
    private PaymentMethod payment;
    @Column(name = "date")
    private LocalDateTime date;
    @Column(columnDefinition = "TEXT")
    private String comment;

}