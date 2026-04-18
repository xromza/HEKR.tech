package com.hekr.store.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


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
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CategoryRequestDto {    
    @NotBlank
    @Schema(description = "Название категории", example = "Аксессуары")
    @Size(max=64)
    private String name;
}
