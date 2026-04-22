package com.hekr.store.mapper;

import com.hekr.store.auth.UserRegistrationDto;
import com.hekr.store.dto.UserResponseDto;
import com.hekr.store.model.IndividualDetails;
import com.hekr.store.model.LegalDetails;
import com.hekr.store.model.User;
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
    default void mapIndividualDetailsToResponse(User user, @MappingTarget UserResponseDto dto) {
        if (user.getIndividualDetails() != null) {
            IndividualDetails details = user.getIndividualDetails();
            dto.setFirstName(details.getFirstName());
            dto.setLastName(details.getLastName());
            dto.setMidName(details.getMidName());
            dto.setBirthDate(details.getBirthDate());
        }
    }

    @AfterMapping
    default void mapLegalDetailsToResponse(User user, @MappingTarget UserResponseDto dto) {
        if (user.getLegalDetails() != null) {
            LegalDetails details = user.getLegalDetails();
            dto.setCompanyName(details.getCompanyName());
            dto.setInn(details.getInn());
            dto.setKpp(details.getKpp());
            dto.setOgrn(details.getOgrn());
            dto.setLegalAddress(details.getLegalAddress());
        }
    }

    List<UserResponseDto> toResponseList(List<User> users);

    private boolean hasData(Object... values) {
        for (Object v : values) if (v != null) return true;
        return false;
    }
}
