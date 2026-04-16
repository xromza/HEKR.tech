package com.hekr.store.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
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
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryResponseDto {
    @Schema(description = "Уникальный идентификатор категории", example = "12345", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;
    
    @Schema(description = "Название категории", example = "Аксессуары")
    private String name;
}
