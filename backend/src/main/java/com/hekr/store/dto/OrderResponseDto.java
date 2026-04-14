package com.hekr.store.dto;

import com.hekr.store.utils.PaymentMethod;
import com.hekr.store.utils.Status;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Setter;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponseDto{
    @Schema(description = "Id заказа",example="111")
    private Long id;
    @Schema(description = "Id пользователя",example="1")
    private Long userId;
    @Schema(description = "Id склада",example="7")
    private Long warehouseId;
    @Schema(description = "Стоимость заказа",example="1337",minimum = "0.01")
    private BigDecimal price;
    @Schema(description = "Адрес доставки",example="г. Токио, ул. Костенко 67, д.10")
    private String address;
    @Schema(description = "Способ оплаты",example="CASH")
    private PaymentMethod payment;
    @Schema(description = "Статус доставки",example="SHIPPED")
    private Status status;
    @Schema(description = "Дата создания заказа",example="2026-04-14T12:30:00")
    private LocalDateTime date;

}