package com.hekr.store.dto.error;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MapLongErrorResponseDto {
    private String error;
    private Map<Long, String> errors;
}
