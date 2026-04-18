package com.hekr.store.dto;

import com.hekr.store.utils.PaymentMethod;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Schema(
    description = "Запрос на оформление заказа из корзины",
    example = """
        {
          "warehouseId": 1,
          "address": "г. Токио, ул. Костенко 67, д.10",
          "payment": "CASH",
          "comment": "Доставить до двери"
        }
        """
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartCheckoutRequestDto {
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