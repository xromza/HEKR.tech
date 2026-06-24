package com.hekr.store.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hekr.store.dto.order.PreOrderItemResponseDto;
import com.hekr.store.dto.order.PreOrderPriceResponseDto;
import com.hekr.store.dto.order.PreOrderRequestDto;
import com.hekr.store.dto.order.PreOrderResponseDto;
import com.hekr.store.dto.warehouse.PreOrderWarehouseResponseDto;
import com.hekr.store.mapper.order.PreOrderMapper;
import com.hekr.store.mapper.stock.StockAvailabilityMapper;
import com.hekr.store.mapper.warehouse.WarehouseMapper;
import com.hekr.store.model.product.Product;
import com.hekr.store.model.product.ProductVariant;
import com.hekr.store.model.stock.Stock;
import com.hekr.store.dto.order.ItemWarehouseAvailabilityResponseDto;
import com.hekr.store.dto.order.OrderItemRequestDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PreOrderService {
        private final WarehouseService warehouseService;
        private final WarehouseMapper warehouseMapper;
        private final StockService stockService;
        private final PreOrderMapper preOrderMapper;
        private final ProductVariantService productVariantService;
        private final StockAvailabilityMapper stockAvailabilityMapper;

        @Transactional(readOnly = true)
        public PreOrderResponseDto getPreOrderInfo(PreOrderRequestDto dto) {
                List<OrderItemRequestDto> aggregatedItems = dto.getItems().stream()
                                .collect(Collectors.toMap(
                                                OrderItemRequestDto::getVariantId, item -> item,
                                                (existing, replacement) -> OrderItemRequestDto.builder()
                                                                .variantId(existing.getVariantId())
                                                                .quantity(existing.getQuantity()
                                                                                + replacement.getQuantity())
                                                                .build()))
                                .values().stream().toList();

                List<PreOrderWarehouseResponseDto> warehouses = warehouseService.findAll().stream()
                                .map(warehouseMapper::toPreOrderResponse).toList();
                List<Long> variantIds = aggregatedItems.stream().map(OrderItemRequestDto::getVariantId).toList();
                Map<Long, List<Stock>> stocks = stockService.getStocksMapByVariantIds(variantIds);
                for (PreOrderWarehouseResponseDto warehouse : warehouses) {
                        boolean canProvideEntireOrder = true;

                        for (OrderItemRequestDto item : aggregatedItems) {
                                int stockOnThisWarehouse = stocks.getOrDefault(item.getVariantId(), List.of())
                                                .stream()
                                                .filter(stock -> stock.getId().warehouseId().equals(warehouse.getId()))
                                                .mapToInt(stock -> stock.getQuantity())
                                                .findFirst()
                                                .orElse(0);
                                if (stockOnThisWarehouse < item.getQuantity()) {
                                        canProvideEntireOrder = false;
                                        break;
                                }
                        }
                        warehouse.setAvailableForOrder(canProvideEntireOrder);
                }

                BigDecimal totalPrice = BigDecimal.ZERO;
                List<PreOrderItemResponseDto> items = new ArrayList<>();
                Map<Long, ProductVariant> variants = productVariantService.getAllVariantsByIds(variantIds);
                for (OrderItemRequestDto item : aggregatedItems) {
                        ProductVariant productVariant = variants.get(item.getVariantId());
                        Product product = productVariant.getProduct();

                        String priceType = item.getQuantity() >= product.getWholesaleThreshold() ? "WHOLESALE"
                                        : "RETAIL";
                        BigDecimal appliedPrice = item.getQuantity() >= product.getWholesaleThreshold()
                                        ? product.getPriceWholesale()
                                        : product.getPriceRetail();
                        PreOrderItemResponseDto preOrderItem = preOrderMapper.toPreOrder(productVariant);
                        BigDecimal subtotal = appliedPrice.multiply(BigDecimal.valueOf(item.getQuantity()));
                        preOrderItem.setPrice(PreOrderPriceResponseDto.builder().base(product.getPriceRetail())
                                        .applied(appliedPrice).type(priceType).build());
                        preOrderItem.setQuantity(item.getQuantity());
                        preOrderItem.setSubtotal(subtotal);

                        List<ItemWarehouseAvailabilityResponseDto> availability = stocks
                                        .getOrDefault(item.getVariantId(), List.of())
                                        .stream()
                                        .map(stockAvailabilityMapper::toResponse)
                                        .filter((itemStock) -> itemStock.availableQuantity > 0)
                                        .toList();

                        Integer maxAvailableQuantity = availability.stream()
                                        .mapToInt(ItemWarehouseAvailabilityResponseDto::getAvailableQuantity).max()
                                        .orElse(0);
                        boolean isAvailable = maxAvailableQuantity >= item.getQuantity();
                        preOrderItem.setAvailable(isAvailable);
                        preOrderItem.setMaxAvailableQuantity(maxAvailableQuantity);
                        preOrderItem.setAvailableAtWarehouses(availability);
                        items.add(preOrderItem);
                        totalPrice = totalPrice.add(subtotal);
                }
                return PreOrderResponseDto
                                .builder()
                                .items(items)
                                .warehouses(warehouses)
                                .totalPrice(totalPrice)
                                .build();
        }
}
