package com.hekr.store.mapper;

import com.hekr.store.dto.IndividualDetailsRequestDto;
import com.hekr.store.model.IndividualDetails;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface IndividualDetailsRequestMapper {
    @Mapping(target = "firstName", source = "firstName")
    @Mapping(target = "lastName", source = "lastName")
    @Mapping(target = "midName", source = "midName")
    @Mapping(target = "birthDate", source = "birthDate")
    @Mapping(target = "passportSeries", source = "passportSeries")
    @Mapping(target = "passportNumber", source = "passportNumber")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    IndividualDetails toEntity(IndividualDetailsRequestDto dto);

    List<IndividualDetails> toEntityList(List<IndividualDetailsRequestDto> dtos);
}