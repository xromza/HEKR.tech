package com.hekr.store.mapper.legal_details;

import com.hekr.store.dto.legal_details.LegalDetailsRequestDto;
import com.hekr.store.model.legal_details.LegalDetails;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LegalDetailsRequestMapper {
    @Mapping(target = "companyName", source = "companyName")
    @Mapping(target = "inn", source = "inn")
    @Mapping(target = "kpp", source = "kpp")
    @Mapping(target = "ogrn", source = "ogrn")
    @Mapping(target = "legalAddress", source = "legalAddress")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    LegalDetails toEntity(LegalDetailsRequestDto details);

    List<LegalDetails> toEntityList(List<LegalDetailsRequestDto> dtos);
}