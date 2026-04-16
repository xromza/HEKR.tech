package com.hekr.store.dto;

import com.hekr.store.utils.PaymentMethod;
import com.hekr.store.utils.Status;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Schema(
    description = "Информация о заказе",
    example = """
        {
          "id": 111,
          "userId": 1,
          "warehouseId": 7,
          "total_price": 1337.00,
          "address": "г. Токио, ул. Костенко 67, д.10",
          "payment_method": "CASH",
          "status": "ASSEMBLING",
          "date": "2026-04-14T12:30:00",
          "items": [
              {
              "variantId": 101,
              "title": "Худи 'Over-size' Базовое",
              "quantity": 12,
              "appliedPrice": 3800.00,
              "subtotal": 45600.00,
              "availableStock": 50,
              "priceType": "WHOLESALE",
              "imageUrl": "https://res.cloudinary.com/xromza/image/upload/v1/products/hoodie_blk_thumb.jpg"
              }
          ],
          "status_history": [
              {
              "orderId": 1025,
              "status": "ASSEMBLING",
              "changedAt": "2026-03-21T18:45:00",
              "changedByName": "madin_manager",
              "comment": "Начата сборка"
              }
          ],
          "priceType": "RETAIL"
        }
        """
)

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponseDto{
    @Schema(description = "Идентификатор заказа", example = "111")
    private Long id;
    @Schema(description = "Идентификатор пользователя", example = "1")
    private Long userId;
    @Schema(description = "Идентификатор склада", example = "7")
    private Long warehouseId;
    @Schema(description = "Общая стоимость заказа", example = "1337.00", minimum = "0.01")
    private BigDecimal total_price;
    @Schema(description = "Адрес доставки", example = "г. Токио, ул. Костенко 67, д.10")
    private String address;
    @Schema(description = "Способ оплаты", example = "CASH")
    private PaymentMethod payment_method;
    @Schema(description = "Статус заказа", example = "SHIPPED")
    private Status status;
    @Schema(description = "Дата создания заказа", example = "2026-04-14T12:30:00")
    private LocalDateTime date;
    @Schema(description = "Список товаров в заказе")
    private List<OrderItemResponseDto> items;
    @Schema(description = "История изменения статуса заказа")
    private List<OrderStatusHistoryResponseDto> statusHistory;
    @Schema(description = "Тип цены", example = "RETAIL")
    private String priceType;
}