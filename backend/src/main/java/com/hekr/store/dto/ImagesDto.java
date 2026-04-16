package com.hekr.store.dto;

import java.time.LocalDateTime;

import com.hekr.store.utils.ImageType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Schema(
    description = "Информация об изображении товара",
    example = """
        {
          "id": 67,
          "url": "https://hekr.kost/img.jpg",
          "type": "MAIN",
          "sortOrder": 1,
          "createdAt": "2023-01-01T00:00:00"
        }
        """
)
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class ImagesDto {
    @Schema(description = "Идентификатор изображения", example = "67", nullable = true)
    private Long id;
    @Schema(description = "URL изображения", example = "https://hekr.kost/img.jpg")
    @NotBlank
    private String url;
    @Schema(description = "Тип изображения", example = "MAIN")
    @NotNull
    private ImageType type;
    @Schema(description = "Порядок сортировки", example = "1")
    private Integer sortOrder;
    @Schema(description = "Дата создания изображения", example = "2023-01-01T00:00:00")
    private LocalDateTime createdAt;
}