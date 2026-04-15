package com.hekr.store.dto;

import com.hekr.store.utils.Status;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Setter;
import lombok.Getter;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(
    description = "История изменения статуса заказа",
    example = """
        {
          "orderId": 69,
          "status": "SHIPPED",
          "changedAt": "2026-04-15T13:37:00",
          "changedByName": "Madin",
          "comment": "Заказ отправлен"
        }
        """
)
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter

public class OrderStatusHistoryResponseDto {
    @Schema(description = "Идентификатор заказа", example = "69")
    private Long orderId;
    @Schema(description = "Статус заказа", example = "SHIPPED")
    private Status status;
    @Schema(description = "Дата и время изменения статуса", example = "2026-04-15T13:37:00")
    private LocalDateTime changedAt;

    @Schema(description = "Имя пользователя, изменившего статус", example = "Madin", nullable = true)
    private String changedByName;
    @Schema(description = "Комментарий к изменению", example = "Заказ отправлен")
    private String comment;
}