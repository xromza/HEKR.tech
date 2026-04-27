package com.hekr.store.mapper.user;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.hekr.store.dto.user.UserEditDto;
import com.hekr.store.model.individual_details.IndividualDetails;
import com.hekr.store.model.legal_details.LegalDetails;
import com.hekr.store.model.user.User;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface UserEditMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "individualDetails", ignore = true)
    @Mapping(target = "legalDetails", ignore = true) 
    @Mapping(target = "authorities", ignore = true)
    @Mapping(target = "isApproved", ignore = true)
    @Mapping(target = "login", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "clientType", ignore = true)
    User updateEntity(UserEditDto dto, @MappingTarget User user);

    @AfterMapping
    default void linkDetails(UserEditDto dto, @MappingTarget User user) {
        if (dto.getPassword() != null) {

        }
        if (hasAny(dto.getFirstName(), dto.getLastName(), dto.getMidName(), dto.getBirthDate())) {
            if (user.getIndividualDetails() == null) {
                IndividualDetails details = IndividualDetails.builder()
                        .user(user)
                        .id(user.getId())
                        .build();
                user.setIndividualDetails(details);
            }
            updateIndividualDetails(dto, user.getIndividualDetails());
        }

        if (hasAny(dto.getCompanyName(), dto.getInn(), dto.getKpp(), dto.getOgrn(), dto.getLegalAddress())) {
            if (user.getLegalDetails() == null) {
                LegalDetails details = LegalDetails.builder()
                        .user(user)
                        .id(user.getId())
                        .build();
                user.setLegalDetails(details);
            }
            updateLegalDetails(dto, user.getLegalDetails());
        }
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "passportSeries", ignore = true) 
    @Mapping(target = "passportNumber", ignore = true)
    void updateIndividualDetails(UserEditDto dto, @MappingTarget IndividualDetails details);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    void updateLegalDetails(UserEditDto dto, @MappingTarget LegalDetails details);

    default boolean hasAny(Object... values) {
        for (Object v : values) if (v != null) return true;
        return false;
    }
}