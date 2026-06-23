package com.hekr.store.dto.order;

import java.util.List;

import com.hekr.store.interfaces.ItemRequestInterface;
import com.hekr.store.utils.PaymentMethod;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
@AllArgsConstructor
public class OrderRequestDto {
    List<ItemRequestInterface> items;
    @Schema(description = "Id склада", example = "1")
    @NotNull
    private Long warehouseId;
    @Schema(description = "Адрес доставки", example = "г. Токио, ул. Костенко 67, д.10")
    @NotBlank
    private String address;
    @Schema(description = "Способ оплаты", example = "CASH")
    @NotNull
    private PaymentMethod payment;
    @Schema(description = "Комментарий к заказу", example = "Доставить до двери")
    private String comment;
}
