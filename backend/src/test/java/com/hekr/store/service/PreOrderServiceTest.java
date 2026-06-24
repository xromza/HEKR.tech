package com.hekr.store.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.hekr.store.dto.order.ItemWarehouseAvailabilityResponseDto;
import com.hekr.store.dto.order.OrderItemRequestDto;
import com.hekr.store.dto.order.PreOrderItemResponseDto;
import com.hekr.store.dto.order.PreOrderRequestDto;
import com.hekr.store.dto.order.PreOrderResponseDto;
import com.hekr.store.dto.warehouse.PreOrderWarehouseResponseDto;
import com.hekr.store.mapper.order.PreOrderMapper;
import com.hekr.store.mapper.stock.StockAvailabilityMapper;
import com.hekr.store.mapper.warehouse.WarehouseMapper;
import com.hekr.store.model.product.Product;
import com.hekr.store.model.product.ProductVariant;
import com.hekr.store.model.warehouse.Warehouse;
import com.hekr.store.model.stock.Stock;
import com.hekr.store.model.stock.StockId;

@ExtendWith(MockitoExtension.class)
class PreOrderServiceTest {

    @Mock
    private WarehouseService warehouseService;

    @Mock
    private WarehouseMapper warehouseMapper;

    @Mock
    private StockService stockService;

    @Mock
    private PreOrderMapper preOrderMapper;

    @Mock
    private ProductVariantService productVariantService;

    @Mock
    private StockAvailabilityMapper stockAvailabilityMapper;

    @InjectMocks
    private PreOrderService preOrderService;

    @Test
    void getPreOrderInfo_WarehouseHasEnoughStock_ReturnsAvailableWarehouseAndRetailPrice() {
        // Arrange
        Long variantId = 1L;
        Long warehouseId = 10L;
        int requestedQuantity = 2;

        OrderItemRequestDto itemRequest = OrderItemRequestDto.builder()
                .variantId(variantId)
                .quantity(requestedQuantity)
                .build();

        PreOrderRequestDto requestDto = new PreOrderRequestDto();
        requestDto.items = List.of(itemRequest);

        Warehouse warehouse = Warehouse.builder()
                .id(warehouseId)
                .address("г. Москва, ул. Петровка, д. 2")
                .build();

        PreOrderWarehouseResponseDto warehouseResponse = new PreOrderWarehouseResponseDto();
        warehouseResponse.setId(warehouseId);

        Product product = Product.builder()
                .priceRetail(BigDecimal.valueOf(1000))
                .priceWholesale(BigDecimal.valueOf(800))
                .wholesaleThreshold(5)
                .build();

        ProductVariant productVariant = ProductVariant.builder()
                .id(variantId)
                .product(product)
                .build();

        StockId stockId = new StockId(variantId, warehouseId);
        Stock stock = Stock.builder()
                .id(stockId)
                .quantity(5)
                .build();

        ItemWarehouseAvailabilityResponseDto availabilityDto = new ItemWarehouseAvailabilityResponseDto();
        availabilityDto.warehouseId = warehouseId;
        availabilityDto.availableQuantity = 5;

        PreOrderItemResponseDto preOrderItemResponse = new PreOrderItemResponseDto();

        when(warehouseService.findAll()).thenReturn(List.of(warehouse));
        when(warehouseMapper.toPreOrderResponse(warehouse)).thenReturn(warehouseResponse);
        when(productVariantService.getAllVariantsByIds(List.of(variantId))).thenReturn(Map.of(variantId, productVariant));
        
        // Оптимизированный мок под Map остатков
        when(stockService.getStocksMapByVariantIds(List.of(variantId))).thenReturn(Map.of(variantId, List.of(stock)));
        
        when(preOrderMapper.toPreOrder(productVariant)).thenReturn(preOrderItemResponse);
        when(stockAvailabilityMapper.toResponse(stock)).thenReturn(availabilityDto);

        // Act
        PreOrderResponseDto result = preOrderService.getPreOrderInfo(requestDto);

        // Assert
        assertNotNull(result);
        assertEquals(BigDecimal.valueOf(2000), result.getTotalPrice());
        assertTrue(result.getWarehouses().get(0).isAvailableForOrder());
        
        PreOrderItemResponseDto finalItem = result.getItems().get(0);
        assertTrue(finalItem.isAvailable());
        assertEquals(5, finalItem.getMaxAvailableQuantity());

        verify(warehouseService).findAll();
        verify(productVariantService).getAllVariantsByIds(List.of(variantId));
        verify(stockService).getStocksMapByVariantIds(List.of(variantId)); // Проверка вызова нового метода
    }

    @Test
    void getPreOrderInfo_WarehouseNotEnoughStock_ReturnsUnavailableWarehouseAndWholesalePrice() {
        // Arrange
        Long variantId = 2L;
        Long warehouseId = 20L;
        int requestedQuantity = 10;

        OrderItemRequestDto itemRequest = OrderItemRequestDto.builder()
                .variantId(variantId)
                .quantity(requestedQuantity)
                .build();

        PreOrderRequestDto requestDto = new PreOrderRequestDto();
        requestDto.items = List.of(itemRequest);

        Warehouse warehouse = Warehouse.builder()
                .id(warehouseId)
                .address("г. Санкт-Петербург, Невский пр., д. 15")
                .build();

        PreOrderWarehouseResponseDto warehouseResponse = new PreOrderWarehouseResponseDto();
        warehouseResponse.setId(warehouseId);

        Product product = Product.builder()
                .priceRetail(BigDecimal.valueOf(1000))
                .priceWholesale(BigDecimal.valueOf(700))
                .wholesaleThreshold(5)
                .build();

        ProductVariant productVariant = ProductVariant.builder()
                .id(variantId)
                .product(product)
                .build();

        StockId stockId = new StockId(variantId, warehouseId);
        Stock stock = Stock.builder()
                .id(stockId)
                .quantity(3)
                .build();

        ItemWarehouseAvailabilityResponseDto availabilityDto = new ItemWarehouseAvailabilityResponseDto();
        availabilityDto.warehouseId = warehouseId;
        availabilityDto.availableQuantity = 3;

        PreOrderItemResponseDto preOrderItemResponse = new PreOrderItemResponseDto();

        when(warehouseService.findAll()).thenReturn(List.of(warehouse));
        when(warehouseMapper.toPreOrderResponse(warehouse)).thenReturn(warehouseResponse);
        when(productVariantService.getAllVariantsByIds(List.of(variantId))).thenReturn(Map.of(variantId, productVariant));
        
        // Оптимизированный мок под Map остатков
        when(stockService.getStocksMapByVariantIds(List.of(variantId))).thenReturn(Map.of(variantId, List.of(stock)));
        
        when(preOrderMapper.toPreOrder(productVariant)).thenReturn(preOrderItemResponse);
        when(stockAvailabilityMapper.toResponse(stock)).thenReturn(availabilityDto);

        // Act
        PreOrderResponseDto result = preOrderService.getPreOrderInfo(requestDto);

        // Assert
        assertNotNull(result);
        assertEquals(BigDecimal.valueOf(7000), result.getTotalPrice());
        assertFalse(result.getWarehouses().get(0).isAvailableForOrder());
        
        PreOrderItemResponseDto finalItem = result.getItems().get(0);
        assertFalse(finalItem.isAvailable());
        assertEquals(3, finalItem.getMaxAvailableQuantity());

        verify(warehouseService).findAll();
        verify(productVariantService).getAllVariantsByIds(List.of(variantId));
        verify(stockService).getStocksMapByVariantIds(List.of(variantId)); // Проверка вызова нового метода
    }
}