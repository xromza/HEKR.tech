package com.hekr.store.dto;

import java.math.BigDecimal;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Schema(
    description = "Информация о скидке для категории",
    example = """
        {
          "categoryId": 5,
          "discount": 0.3
        }
        """
)
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DiscountDto {
    @Schema(description = "Идентификатор категории", example = "5")
    private Long categoryId;
    @Schema(description = "Значение скидки (от 0 до 1)", example = "0.3")
    @Min(0)
    @Max(1)
    private BigDecimal discount;
}
