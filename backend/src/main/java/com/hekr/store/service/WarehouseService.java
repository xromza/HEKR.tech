package com.hekr.store.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hekr.store.exceptions.NotFoundException;
import com.hekr.store.model.warehouse.Warehouse;
import com.hekr.store.repository.WarehouseRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WarehouseService {
    private final WarehouseRepository warehouseRepository;

    public Warehouse findById(Long id) {
        return warehouseRepository.findById(id).orElseThrow(() -> new NotFoundException("Склад не найден"));
    }

    public List<Warehouse> findAll() {
        return warehouseRepository.findAll();
    }
    @Transactional
    public Warehouse createNew(String address) {
        Warehouse warehouse = Warehouse.builder()
                .address(address).build();
        return warehouseRepository.save(warehouse);

    }

}
