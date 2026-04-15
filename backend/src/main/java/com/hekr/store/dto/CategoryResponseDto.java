package com.hekr.store.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
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
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CategoryResponseDto {
    @Schema(description = "Уникальный идентификатор категории", example = "12345", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;
    
    @Schema(description = "Название категории", example = "Аксессуары")
    private String name;
}
