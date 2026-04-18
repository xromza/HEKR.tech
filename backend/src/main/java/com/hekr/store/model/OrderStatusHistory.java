package com.hekr.store.model;


import com.hekr.store.utils.Status;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Builder
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