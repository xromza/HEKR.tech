package com.hekr.store.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(
    description = "Запрос на создание категории",
    example = """
        {
          "name": "Аксессуары"
        }
        """
)
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryRequestDto {    
    @NotBlank
    @Schema(description = "Название категории", example = "Аксессуары")
    @Size(max=64)
    private String name;
}
