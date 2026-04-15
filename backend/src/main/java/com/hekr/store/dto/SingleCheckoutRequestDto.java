package com.hekr.store.dto;

import com.hekr.store.utils.PaymentMethod;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Setter;
import lombok.Getter;

@Schema(
    description = "Запрос на оформление заказа для одного товара",
    example = """
        {
          "variantId": 1,
          "quantity": 2,
          "warehouseId": 1,
          "address": "г. Токио, ул. Костенко 67, д.10",
          "payment": "CASH",
          "comment": "Пожалуйста, упакуйте аккуратно"
        }
        """
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SingleCheckoutRequestDto {
    @Schema(description = "Идентификатор варианта товара", example = "1")
    private Long variantId;
    @Schema(description = "Количество товара", example = "2")
    private Integer quantity;
    @Schema(description = "Id склада", example = "1")
    @NotNull
    private Long warehouseId;
    @Schema(description = "Адрес доставки", example = "г. Токио, ул. Костенко 67, д.10")
    @NotBlank
    private String address;
    @Schema(description = "Способ оплаты", example = "CASH")
    @NotNull
    private PaymentMethod payment;
    @Schema(description = "Комментарий к заказу", example = "Пожалуйста, упакуйте аккуратно")
    private String comment;
}