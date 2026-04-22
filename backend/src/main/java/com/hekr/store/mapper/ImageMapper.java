package com.hekr.store.mapper;

import com.hekr.store.dto.ImagesDto;
import com.hekr.store.model.Image;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring")
public interface ImageMapper {
    @Mapping(target = "id", source = "id")
    @Mapping(target = "url", source = "url")
    @Mapping(target = "type", source = "type")
    @Mapping(target = "sortOrder", source = "sortOrder")
    @Mapping(target = "createdAt", source = "createdAt")
    ImagesDto toDto(Image image);

    List<ImagesDto> toDtoList(Set<Image> images);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "variant", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "url", source = "url")
    @Mapping(target = "type", source = "type")
    @Mapping(target = "sortOrder", source = "sortOrder")
    Image toEntity(ImagesDto dto);
}