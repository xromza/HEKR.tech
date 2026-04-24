package com.hekr.store.mapper.user;

import com.hekr.store.dto.auth.UserRegistrationDto;
import com.hekr.store.dto.user.UserResponseDto;
import com.hekr.store.model.individual_details.IndividualDetails;
import com.hekr.store.model.legal_details.LegalDetails;
import com.hekr.store.model.user.User;

import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "isApproved", ignore = true)
    @Mapping(target = "passwordHash", source = "password")
    @Mapping(target = "individualDetails", ignore = true)
    @Mapping(target = "legalDetails", ignore = true)
    @Mapping(target = "role", source = "role")
    @Mapping(target = "clientType", source = "clientType")
    @Mapping(target = "login", source = "login")
    @Mapping(target = "phone", source = "phone")
    @Mapping(target = "email", source = "email")
    User toEntity(UserRegistrationDto registrationDto);

    @AfterMapping
    default void mapDetails(UserRegistrationDto dto, @MappingTarget User.UserBuilder userBuilder) {
        if (hasData(dto.getFirstName(), dto.getLastName(), dto.getMidName(), dto.getBirthDate())) {
            IndividualDetails ind = new IndividualDetails();
            ind.setFirstName(dto.getFirstName());
            ind.setLastName(dto.getLastName());
            ind.setMidName(dto.getMidName());
            ind.setBirthDate(dto.getBirthDate());
            userBuilder.individualDetails(ind);
        }
        if (hasData(dto.getCompanyName(), dto.getInn(), dto.getKpp(), dto.getOgrn(), dto.getLegalAddress())) {
            LegalDetails leg = new LegalDetails();
            leg.setCompanyName(dto.getCompanyName());
            leg.setInn(dto.getInn());
            leg.setKpp(dto.getKpp());
            leg.setOgrn(dto.getOgrn());
            leg.setLegalAddress(dto.getLegalAddress());
            userBuilder.legalDetails(leg);
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
    @Mapping(target = "firstName", ignore = true)
    @Mapping(target = "lastName", ignore = true)
    @Mapping(target = "midName", ignore = true)
    @Mapping(target = "birthDate", ignore = true)
    @Mapping(target = "companyName", ignore = true)
    @Mapping(target = "inn", ignore = true)
    @Mapping(target = "kpp", ignore = true)
    @Mapping(target = "ogrn", ignore = true)
    @Mapping(target = "legalAddress", ignore = true)
    UserResponseDto toResponse(User user);

    @AfterMapping
    default void fillDetails(User user, @MappingTarget UserResponseDto.UserResponseDtoBuilder dtoBuilder) {
        if (user.getIndividualDetails() != null) {
            IndividualDetails details = user.getIndividualDetails();
            dtoBuilder.firstName(details.getFirstName())
                    .lastName(details.getLastName())
                    .midName(details.getMidName())
                    .birthDate(details.getBirthDate());
        }

        if (user.getLegalDetails() != null) {
            LegalDetails details = user.getLegalDetails();
            dtoBuilder.companyName(details.getCompanyName())
                    .inn(details.getInn())
                    .kpp(details.getKpp())
                    .ogrn(details.getOgrn())
                    .legalAddress(details.getLegalAddress());
        }
    }

    List<UserResponseDto> toResponseList(List<User> users);

    private boolean hasData(Object... values) {
        for (Object v : values)
            if (v != null)
                return true;
        return false;
    }
}
