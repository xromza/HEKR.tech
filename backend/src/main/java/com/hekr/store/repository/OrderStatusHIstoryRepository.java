package com.hekr.store.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hekr.store.model.OrderStatusHistory;

public interface OrderStatusHIstoryRepository extends JpaRepository<OrderStatusHistory, Long> {
    
}
