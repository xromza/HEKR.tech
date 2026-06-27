package com.hekr.store.dto.header;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
public class HeaderResponseDto {
    private Long accessoriesCount;
    private Long manCount;
    private Long womenCount;
}
