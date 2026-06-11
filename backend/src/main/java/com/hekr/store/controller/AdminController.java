package com.hekr.store.controller;

import com.hekr.store.service.CategoryService;
import com.hekr.store.service.DiscountService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hekr.store.dto.category.CategoryRequestDto;
import com.hekr.store.dto.category.CategoryResponseDto;
import com.hekr.store.dto.discount.DiscountDto;
import com.hekr.store.dto.order.OrderStatusHistoryRequestDto;
import com.hekr.store.dto.order.OrderStatusHistoryResponseDto;
import com.hekr.store.dto.product.ProductRequestDto;
import com.hekr.store.dto.product.ProductResponseDto;
import com.hekr.store.dto.product.ProductVariantRequestDto;
import com.hekr.store.dto.product.ProductVariantResponseDto;
import com.hekr.store.dto.user.UserResponseDto;
import com.hekr.store.mapper.user.UserMapper;
import com.hekr.store.model.stock.Stock;
import com.hekr.store.model.warehouse.Warehouse;
import com.hekr.store.service.OrderService;
import com.hekr.store.service.ProductService;
import com.hekr.store.service.ProductVariantService;
import com.hekr.store.service.StockService;
import com.hekr.store.service.UserService;
import com.hekr.store.service.WarehouseService;

import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
    private final WarehouseService warehouseService;
    private final StockService stockService;
    private final UserService userService;
    private final UserMapper userMapper;
    private final OrderService orderService;
    private final ProductService productService;
    private final ProductVariantService productVariantService;
    private final CategoryService categoryService;
    private final DiscountService discountService;
    @GetMapping("/warehouse")
    public ResponseEntity<List<Warehouse>> getWarehouses() {
        return ResponseEntity.ok(warehouseService.findAll());
    }

    @PostMapping("/warehouse")
    public ResponseEntity<Warehouse> createNewWarehouse(@RequestBody String address) {
        return ResponseEntity.ok(warehouseService.createNew(address));
    }

    @PutMapping("/stock/{warehouseId}")
    public ResponseEntity<Stock> updateStock(@PathVariable Long warehouseId,
            @RequestParam Long variantId, @RequestBody Integer quantity) {
        return ResponseEntity.ok(stockService.upsertStock(variantId, warehouseId, quantity));
    }

    @GetMapping("/stock/{warehouseId}")
    public ResponseEntity<List<Stock>> getStockOnWarehouse(@PathVariable Long warehouseId) {
        return ResponseEntity.ok(stockService.getAllByWarehouseId(warehouseId));
    }

    @GetMapping("/stock/{warehouseId}/")
    public ResponseEntity<Stock> getVariantStockOnWarehouse(@PathVariable Long warehouseId, @RequestParam Long variantId) {
        return ResponseEntity.ok(stockService.getByVariantIdAndWarehouseId(variantId, warehouseId));
    }
    @GetMapping("/users")
    public ResponseEntity<List<UserResponseDto>> getUsers(Pageable pageable, @RequestParam Boolean approved) {
        return ResponseEntity.ok(userMapper.toResponseList(userService.getAll(pageable, approved)));
    }

    @PatchMapping("/orders/{orderId}/status")
    public ResponseEntity<OrderStatusHistoryResponseDto> updateStatus(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long orderId, @RequestBody OrderStatusHistoryRequestDto request) {
        return ResponseEntity.ok(orderService.updateStatus(userDetails, orderId, request.getStatus(), request.getComment()));
    }

    @PostMapping("/products")
    public ResponseEntity<ProductResponseDto> createProduct(@RequestBody ProductRequestDto productRequestDto) {
        return ResponseEntity.ok(productService.createProduct(productRequestDto));
    }
    
    @PostMapping("/categories")
    public ResponseEntity<CategoryResponseDto> createCategory(@RequestBody CategoryRequestDto dto) {
        return ResponseEntity.ok(categoryService.createCategory(dto));
    }
    @PostMapping("/products/{productId}/variants")
    public ResponseEntity<ProductVariantResponseDto> createVariant(@PathVariable Long productId, @RequestBody ProductVariantRequestDto dto) {
        return ResponseEntity.ok(productVariantService.createVariant(dto, productId));
    }

    @PatchMapping("/discounts/{categoryId}")
    public ResponseEntity<DiscountDto> updateDiscount(@PathVariable Long categoryId, @RequestBody BigDecimal discount) {
        return ResponseEntity.ok(discountService.updateDiscount(categoryId, discount));
    }
    
}
