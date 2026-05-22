package com.hekr.store.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hekr.store.dto.order.CartCheckoutRequestDto;
import com.hekr.store.dto.order.OrderResponseDto;
import com.hekr.store.dto.order.SingleCheckoutRequestDto;
import com.hekr.store.exceptions.ForbiddenException;
import com.hekr.store.interfaces.OrderDtoInterface;
import com.hekr.store.model.user.User;
import com.hekr.store.service.OrderService;
import com.hekr.store.service.UserService;

import jakarta.validation.Valid;
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
    public ResponseEntity<List<? extends OrderDtoInterface>> getOrders(@AuthenticationPrincipal UserDetails userDetails, @RequestParam(required = false, defaultValue = "false") boolean verbose) {
        return ResponseEntity.ok(orderService.getOrders(userDetails, verbose));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDto> getOrder(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        OrderResponseDto order = orderService.getOrder(id);
        User user = userService.findByLogin(userDetails.getUsername());
        if (user.getId() != order.getUserId())
            throw new ForbiddenException("Нет прав на просмотр этого заказа");
        return ResponseEntity.ok(order);
    }

    @PostMapping("/all")
    public ResponseEntity<OrderResponseDto> cartCheckout(@AuthenticationPrincipal UserDetails userDetails,
           @Valid @RequestBody CartCheckoutRequestDto dto) {
        return ResponseEntity.ok(orderService.createCartOrder(userDetails, dto));
    }

    @PostMapping("/single")
    public ResponseEntity<OrderResponseDto> singleCheckout(@AuthenticationPrincipal UserDetails userDetails,
           @Valid @RequestBody SingleCheckoutRequestDto dto) {
        return ResponseEntity.ok(orderService.createSingleOrder(userDetails, dto));
    }

}
