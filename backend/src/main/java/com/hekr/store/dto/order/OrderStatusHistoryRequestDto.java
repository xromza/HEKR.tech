package com.hekr.store.dto.order;

import com.hekr.store.utils.Status;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Schema(description = "Изменение состояние заказа", example = """
        {
          "status": "SHIPPED",
          "comment": "Заказ отправлен"
        }
        """)
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderStatusHistoryRequestDto {
    @NotNull
    private Status status;
    @NotBlank
    private String comment;
}
