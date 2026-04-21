package com.hekr.store.mapper;

import com.hekr.store.dto.LegalDetailsResponseDto;
import com.hekr.store.model.LegalDetails;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")

public interface LegalDetailsResponseMapper {
    @Mapping(target = "companyName",source = "companyName")
    @Mapping(target = "inn",source = "inn")
    @Mapping(target = "kpp",source = "kpp")
    @Mapping(target = "ogrn",source = "ogrn")
    @Mapping(target = "legalAddress",source = "legalAddress")
    LegalDetailsResponseDto toDto(LegalDetails details);

    List<LegalDetailsResponseDto> toDtoList(List<LegalDetails> dtos);

}