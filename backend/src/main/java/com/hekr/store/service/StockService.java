package com.hekr.store.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hekr.store.exceptions.NotFoundException;
import com.hekr.store.model.stock.Stock;
import com.hekr.store.model.stock.StockId;
import com.hekr.store.repository.StockRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StockService {
    private final StockRepository stockRepository;

    public List<Stock> getByVariantId(Long variantId) {
        return stockRepository.findAllByVariantId(variantId);
    }

    public Stock getByVariantIdAndWarehouseId(Long variantId, Long warehouseId) {
        return stockRepository.findById(new StockId(variantId, warehouseId))
                .orElseThrow(() -> new NotFoundException("Данный вариант товара не найден на складе"));
    }
}
