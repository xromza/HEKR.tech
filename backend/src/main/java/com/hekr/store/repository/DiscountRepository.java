package com.hekr.store.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hekr.store.model.Discount;

public interface DiscountRepository extends JpaRepository<Discount, Long> { }
