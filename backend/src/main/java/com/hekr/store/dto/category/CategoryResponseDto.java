package com.hekr.store.dto.category;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(
    description = "Информация о категории",
    example = """
        {
          "id": 12345,
          "name": "Аксессуары"
        }
        """
)
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CategoryResponseDto {
    @Schema(description = "Уникальный идентификатор категории", example = "12345", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;
    
    @Schema(description = "Название категории", example = "Аксессуары")
    private String name;

    @Schema(description = "Скидка в данной категории", example="0.05")
    private BigDecimal discount;
}
