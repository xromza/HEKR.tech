package com.hekr.store.dto;

import com.hekr.store.utils.PaymentMethod;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Setter;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequestDto {
    @Schema(description = "Id склада",example="1")
    @NotNull
    private Long warehouseId;
    @Schema(description = "Адрес доставки",example="г. Токио, ул. Костенко 67, д.10")
    @NotBlank
    private String address;
    @Schema(description = "Способ оплаты",example="CASH")
    @NotNull
    private PaymentMethod payment;
}