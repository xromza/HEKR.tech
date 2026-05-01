package com.hekr.store.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hekr.store.dto.order.CartCheckoutRequestDto;
import com.hekr.store.dto.order.OrderResponseDto;
import com.hekr.store.exceptions.ForbiddenException;
import com.hekr.store.model.user.User;
import com.hekr.store.service.OrderService;
import com.hekr.store.service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
    
@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {
    private final UserService userService;
    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderResponseDto>> getOrders(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(orderService.getOrders(userDetails));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDto> getOrder(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id) {
        OrderResponseDto order = orderService.getOrder(id);
        User user = userService.findByLogin(userDetails.getUsername());
        if (user.getId() != order.getUserId())
            throw new ForbiddenException("Нет прав на просмотр этого заказа");
        return ResponseEntity.ok(order);
    }

    @PostMapping("/all")
    public ResponseEntity<OrderResponseDto> cartCheckout(@AuthenticationPrincipal UserDetails userDetails,
            @RequestBody CartCheckoutRequestDto dto) {
                return ResponseEntity.ok(orderService.createCartOrder(userDetails, dto));
    }

}
