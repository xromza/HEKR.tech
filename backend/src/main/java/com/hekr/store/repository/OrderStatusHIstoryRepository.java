package com.hekr.store.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hekr.store.model.order.OrderStatusHistory;

public interface OrderStatusHIstoryRepository extends JpaRepository<OrderStatusHistory, Long> {
    
}
