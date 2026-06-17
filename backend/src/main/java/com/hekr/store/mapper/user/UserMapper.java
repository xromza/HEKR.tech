package com.hekr.store.mapper.user;

import com.hekr.store.dto.auth.UserRegistrationDto;
import com.hekr.store.dto.individual_details.IndividualDetailsRequestDto;
import com.hekr.store.dto.individual_details.IndividualDetailsResponseDto;
import com.hekr.store.dto.legal_details.LegalDetailsRequestDto;
import com.hekr.store.dto.legal_details.LegalDetailsResponseDto;
import com.hekr.store.dto.user.UserResponseDto;
import com.hekr.store.model.individual_details.IndividualDetails;
import com.hekr.store.model.legal_details.LegalDetails;
import com.hekr.store.model.user.User;


import java.util.List;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "isApproved", ignore = true)
    @Mapping(target = "passwordHash", source = "password")
    @Mapping(target = "individualDetails", ignore = true)
    @Mapping(target = "legalDetails", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "clientType", ignore = true)
    @Mapping(target = "login", source = "login")
    @Mapping(target = "phone", source = "phone")
    @Mapping(target = "email", source = "email")
    User toEntity(UserRegistrationDto registrationDto);

    @AfterMapping
    default void mapDetails(UserRegistrationDto dto, @MappingTarget User user) {
        if (dto.getDetails() instanceof IndividualDetailsRequestDto indDto) {
            user.setIndividualDetails(IndividualDetails.builder()
                    .firstName(indDto.getFirstName())
                    .lastName(indDto.getLastName())
                    .user(user)
                    .build());
        } else if (dto.getDetails() instanceof LegalDetailsRequestDto legalDto) {
            user.setLegalDetails(LegalDetails.builder()
                    .companyName(legalDto.getCompanyName())
                    .inn(legalDto.getInn())
                    .user(user)
                    .build());
        }
    }

    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    @Mapping(target = "role", source = "role")
    @Mapping(target = "createdAt", source = "createdAt")
    @Mapping(target = "isApproved", source = "isApproved")
    @Mapping(target = "clientType", source = "clientType")
    @Mapping(target = "phone", source = "phone")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "details", ignore = true)
    UserResponseDto toResponse(User user);

    @AfterMapping
    default void fillDetails(User user, @MappingTarget UserResponseDto.UserResponseDtoBuilder dtoBuilder) {
        if (user.getIndividualDetails() != null) {
            var ind = user.getIndividualDetails();
            dtoBuilder.details(IndividualDetailsResponseDto.builder()
                    .firstName(ind.getFirstName())
                    .lastName(ind.getLastName())
                    .midName(ind.getMidName())
                    .birthDate(ind.getBirthDate())
                    .build());
        } else if (user.getLegalDetails() != null) {
            var legal = user.getLegalDetails();
            dtoBuilder.details(LegalDetailsResponseDto.builder()
                    .companyName(legal.getCompanyName())
                    .inn(legal.getInn())
                    .kpp(legal.getKpp())
                    .ogrn(legal.getOgrn())
                    .legalAddress(legal.getLegalAddress())
                    .build());
        }
    }

    List<UserResponseDto> toResponseList(List<User> users);
}
