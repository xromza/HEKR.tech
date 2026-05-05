package com.hekr.store.dto.category;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
public class CategoriesDtoResponse {
    Set<CategoryResponseDto> categories;    
}
