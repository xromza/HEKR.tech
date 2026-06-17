package com.hekr.store.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hekr.store.model.warehouse.Warehouse;

public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {

}
