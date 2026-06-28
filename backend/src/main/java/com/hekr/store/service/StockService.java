package com.hekr.store.service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hekr.store.dto.stock.StockResponsePlainDto;
import com.hekr.store.exceptions.BadRequestException;
import com.hekr.store.exceptions.NotFoundException;
import com.hekr.store.mapper.stock.StockResponsePlainMapper;
import com.hekr.store.model.order.OrderItem;
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
    private final StockResponsePlainMapper stockResponsePlainMapper;
    private final WarehouseService warehouseService;
    private final ProductVariantService productVariantService;

    public List<Stock> getByVariantId(Long variantId) {
        return stockRepository.findAllByVariantId(variantId);
    }

    public Stock getByVariantIdAndWarehouseId(Long variantId, Long warehouseId) {
        return stockRepository.findById(new StockId(variantId, warehouseId))
                .orElseThrow(() -> new NotFoundException("Данный вариант товара не найден на складе"));
    }

    public List<StockResponsePlainDto> getAllByWarehouseId(Long warehouseId) {
        return stockResponsePlainMapper.toResponseList(stockRepository.findAllByWarehouseId(warehouseId));
    }

    @Transactional(readOnly = true)
    public Map<Long, Stock> getStocksMapByVariantIdsAndWarehouseId(Long warehouseId, List<Long> variantIds) {
        if (variantIds == null || variantIds.isEmpty()) {
            return Map.of();
        }

        List<Stock> stocks = stockRepository.findAllByWarehouseIdAndVariantIdsIn(warehouseId, variantIds);
        return stocks.stream().collect(Collectors.toMap(stock -> stock.getId().variantId(), stock -> stock));
    }

    @Transactional(readOnly = true)
    public Map<Long, List<Stock>> getStocksMapByVariantIds(List<Long> variantIds) {
        if (variantIds == null || variantIds.isEmpty()) {
            return Map.of();
        }

        List<Stock> stocks = stockRepository.findAllByVariantIdsIn(variantIds);
        return stocks.stream()
                .collect(Collectors.groupingBy(stock -> stock.getId().variantId()));
    }

    @Transactional
    public void saveStock(Stock stock) {
        stockRepository.save(stock);
    }

    @Transactional
    public StockResponsePlainDto upsertStock(Long variantId, Long warehouseId, Integer quantity) {

        StockId stockId = new StockId(variantId, warehouseId);

        Stock stock = stockRepository.findById(stockId)
                .orElseGet(() -> createNewStock(stockId, warehouseId, variantId));
        stock.setQuantity(quantity);
        if (stock.getVersion() == null)
            stock = stockRepository.save(stock);
        return stockResponsePlainMapper.toResponse(stock);
    }

    @Transactional
    public void revertStocks(Set<OrderItem> items, Long warehouseId) {
        for (OrderItem item : items) {
            addStock(item.getProductVariant().getId(), warehouseId, item.getQuantity());
        }
    }

    @Transactional
    public StockResponsePlainDto addStock(Long variantId, Long warehouseId, Integer diff) {
        StockId stockId = new StockId(variantId, warehouseId);
        Stock stock = stockRepository.findById(stockId).orElseThrow(() -> new NotFoundException("Склад не найден"));
        Integer curQuantity = stock.getQuantity();
        if (diff < -curQuantity) {
            throw new BadRequestException("На складе не может быть отрицательное количество товара");
        }
        stock.setQuantity(curQuantity + diff);
        return stockResponsePlainMapper.toResponse(stockRepository.save(stock));
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
