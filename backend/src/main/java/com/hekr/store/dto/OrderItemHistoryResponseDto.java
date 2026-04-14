package com.hekr.store.dto;

import com.hekr.store.utils.Status;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Setter;
import lombok.Getter;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter

public class OrderItemHistoryResponseDto{
    @Schema(description = "Статус заказа",example = "SHIPPED")
    private Status status;
    @Schema(description = "Дата и время изменения",example = "2026-04-15T13:37:00")
    private LocalDateTime changedAt;
    @Schema(description = "Id, изменившего статус",example="67",nullable = true)
    private Long changedById;
}