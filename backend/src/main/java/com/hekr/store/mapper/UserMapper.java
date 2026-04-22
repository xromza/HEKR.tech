package com.hekr.store.mapper;

import com.hekr.store.dto.UserRegistrationDto;
import com.hekr.store.dto.UserResponseDto;
import com.hekr.store.model.IndividualDetails;
import com.hekr.store.model.LegalDetails;
import com.hekr.store.model.User;
import org.mapstruct.*;

import java.util.List;


@Mapper(componentModel = "spring")

public interface UserMapper {
    @Mapping(target="id",ignore = true)
    @Mapping(target = "createdAt",ignore = true)
    @Mapping(target = "isApproved",ignore = true)
    @Mapping(target="passwordHash",source = "password")
    @Mapping(target="individualDetails",ignore = true)
    @Mapping(target = "legalDetails",ignore = true)
    User toEntity(UserRegistrationDto registrationDto);

    @Mapping(target = "passwordHash",ignore = true)
    @Mapping(target = "firstName", source = "individualDetails.firstName")
    @Mapping(target = "lastName", source = "individualDetails.lastName")
    @Mapping(target = "midName", source = "individualDetails.midName")
    @Mapping(target = "birthDate", source = "individualDetails.birthDate")
    @Mapping(target = "companyName", source = "legalDetails.companyName")
    @Mapping(target = "inn", source = "legalDetails.inn")
    @Mapping(target = "kpp", source = "legalDetails.kpp")
    @Mapping(target = "ogrn", source = "legalDetails.ogrn")
    @Mapping(target = "legalAddress", source = "legalDetails.legalAddress")
    UserResponseDto toResponse(User user);

    List<UserResponseDto> toResponseList(List<User> user);
    @AfterMapping
    default void mapDetails(UserRegistrationDto dto, @MappingTarget User user) {
        if (hasData(dto.getFirstName(), dto.getLastName(), dto.getMidName(), dto.getBirthDate())) {
            IndividualDetails ind = new IndividualDetails();
            ind.setUser(user);
            ind.setFirstName(dto.getFirstName());
            ind.setLastName(dto.getLastName());
            ind.setMidName(dto.getMidName());
            ind.setBirthDate(dto.getBirthDate());
            user.setIndividualDetails(ind);
        }
        if (hasData(dto.getCompanyName(), dto.getInn(), dto.getKpp(), dto.getOgrn(), dto.getLegalAddress())) {
            LegalDetails leg = new LegalDetails();
            leg.setUser(user);
            leg.setCompanyName(dto.getCompanyName());
            leg.setInn(dto.getInn());
            leg.setKpp(dto.getKpp());
            leg.setOgrn(dto.getOgrn());
            leg.setLegalAddress(dto.getLegalAddress());
            user.setLegalDetails(leg);
        }
    }
    private boolean hasData(Object... values) {
        for (Object v : values) if (v != null) return true;
        return false;
    }
}