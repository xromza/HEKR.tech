package com.hekr.store.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hekr.store.exceptions.NotFoundException;
import com.hekr.store.model.product.ProductVariant;
import com.hekr.store.model.stock.Stock;
import com.hekr.store.model.stock.StockId;
import com.hekr.store.model.warehouse.Warehouse;
import com.hekr.store.repository.StockRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StockService {
    private final StockRepository stockRepository;
    private final WarehouseService warehouseService;
    private final ProductVariantService productVariantService;

    public List<Stock> getByVariantId(Long variantId) {
        return stockRepository.findAllByVariantId(variantId);
    }

    public Stock getByVariantIdAndWarehouseId(Long variantId, Long warehouseId) {
        return stockRepository.findById(new StockId(variantId, warehouseId))
                .orElseThrow(() -> new NotFoundException("Данный вариант товара не найден на складе"));
    }

    public List<Stock> getAllByWarehouseId(Long warehouseId) {
        return stockRepository.findAllByWarehouseId(warehouseId);
    }
    @Transactional
    public Map<Long, Stock> getStocksMapByVariantIds(Long warehouseId, List<Long> variantIds) {
        if (variantIds == null || variantIds.isEmpty()) {
            return Map.of();
        }

        List<Stock> stocks = stockRepository.findAllByWarehouseIdAndVariantIdsIn(warehouseId, variantIds);
        return stocks.stream().collect(Collectors.toMap(stock -> stock.getId().variantId(), stock -> stock));
    }

    @Transactional
    public void saveStock(Stock stock) {
        stockRepository.save(stock);
    }

    @Transactional
    public Stock upsertStock(Long variantId, Long warehouseId, Integer quantity) {

        StockId stockId = new StockId(variantId, warehouseId);

        Stock stock = stockRepository.findById(stockId)
                .orElseGet(() -> createNewStock(stockId, warehouseId, variantId));
        stock.setQuantity(quantity);
        if (stock.getVersion() == null)
            stock = stockRepository.save(stock);
        return stock;
    }

    private Stock createNewStock(StockId stockId, Long warehouseId, Long variantId) {
        ProductVariant productVariant = productVariantService.getProductVariantById(variantId);
        Warehouse warehouse = warehouseService.findById(warehouseId);

        return Stock.builder()
                .id(stockId)
                .warehouse(warehouse)
                .variant(productVariant)
                .build();
    }
}
