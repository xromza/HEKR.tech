package com.hekr.store.service;

import org.springframework.stereotype.Service;

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
}
