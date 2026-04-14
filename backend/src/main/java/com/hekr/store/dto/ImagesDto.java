package com.hekr.store.dto;

import com.hekr.store.utils.ImageType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Setter;
import lombok.Getter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter

public class ImagesDto {
    @Schema(description="Id изображения",example="67",nullable = true)
    private Long id;
    @Schema(description = "URL изображения",example="https://hekr.kost/img.jpg")
    @NotBlank
    private String url;
    @Schema(description = "Тип изображения",example="Main")
    @NotNull
    private ImageType imageType;
    @Schema(description = "Порядок сортировки", example = "1")
    private Integer sortOrder;
}