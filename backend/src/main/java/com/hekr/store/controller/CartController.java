package com.hekr.store.controller;

import org.apache.catalina.connector.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hekr.store.dto.cart.CartItemRequestDto;
import com.hekr.store.dto.cart.CartItemResponseDto;
import com.hekr.store.dto.cart.CartResponseDto;
import com.hekr.store.service.CartService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/cart")
public class CartController {
    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartResponseDto> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(cartService.getCart(userDetails));
    }

    @PostMapping
    public ResponseEntity<CartItemResponseDto> changeQuantity(@AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CartItemRequestDto dto) {
        return ResponseEntity.ok(cartService.addOrUpdateItem(userDetails, dto));
    }

    @DeleteMapping("/{variantId}")
    public ResponseEntity<Void> deleteSingle(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable(name = "variantId") Long variantId) {
        cartService.deleteItem(userDetails, variantId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAll(
            @AuthenticationPrincipal UserDetails userDetails) {
        cartService.deleteAll(userDetails);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}
