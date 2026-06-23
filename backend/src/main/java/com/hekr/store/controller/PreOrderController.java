package com.hekr.store.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hekr.store.dto.order.PreOrderRequestDto;
import com.hekr.store.dto.order.PreOrderResponseDto;
import com.hekr.store.service.PreOrderService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/orders")
public class PreOrderController {
    private final PreOrderService preOrderService;

    @PostMapping("/preview")
    public ResponseEntity<PreOrderResponseDto> getPreviewOfOrder(@RequestBody PreOrderRequestDto dto) {
        return ResponseEntity.ok(preOrderService.getPreOrderInfo(dto));
    }
    
}
