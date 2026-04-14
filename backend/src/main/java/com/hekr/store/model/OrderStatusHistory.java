package com.hekr.store.model;


import com.hekr.store.utils.Status;
import lombok.*;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class OrderStatusHistory{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="order_id",nullable = false)
    private Order order;
    @Column(name="new_status",nullable = false,length=32)
    @Enumerated(EnumType.STRING)
    private Status newStatus;
    @Column(name="changed_at",nullable = false)
    private LocalDateTime changedAt;
    @Column(name="changed_by",nullable = false)
    private Long changedByUserId;
    @Column(columnDefinition = "TEXT",nullable = false)
    private String comment;
}