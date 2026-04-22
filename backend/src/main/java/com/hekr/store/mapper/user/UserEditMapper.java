package com.hekr.store.mapper.user;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.hekr.store.dto.user.UserEditDto;
import com.hekr.store.model.individual_details.IndividualDetails;
import com.hekr.store.model.legal_details.LegalDetails;
import com.hekr.store.model.user.User;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)

public interface UserEditMapper {
    @Mapping(target = "id",ignore = true)
    @Mapping(target = "createdAt",ignore = true)
    @Mapping(target="passwordHash",ignore = true)
    @Mapping(target = "individualDetails", ignore = true)
    @Mapping(target = "legalDetails", ignore = true)
    void updateEntity(UserEditDto dto,@MappingTarget User user);
    @AfterMapping
    default void updateDetails(UserEditDto dto, @MappingTarget User user) {
        if (hasAny(dto.getFirstName(), dto.getLastName(), dto.getMidName(), dto.getBirthDate())) {
            IndividualDetails details = user.getIndividualDetails();
            if (details == null) {
                details = new IndividualDetails();
                details.setUser(user);
                user.setIndividualDetails(details);
            }
            if (dto.getFirstName() != null) details.setFirstName(dto.getFirstName());
            if (dto.getLastName() != null) details.setLastName(dto.getLastName());
            if (dto.getMidName() != null) details.setMidName(dto.getMidName());
            if (dto.getBirthDate() != null) details.setBirthDate(dto.getBirthDate());
        }
        if (hasAny(dto.getCompanyName(), dto.getInn(), dto.getKpp(), dto.getOgrn(), dto.getLegalAddress())) {
            LegalDetails details = user.getLegalDetails();
            if (details == null) {
                details = new LegalDetails();
                details.setUser(user);
                user.setLegalDetails(details);
            }
            if (dto.getCompanyName() != null) details.setCompanyName(dto.getCompanyName());
            if (dto.getInn() != null) details.setInn(dto.getInn());
            if (dto.getKpp() != null) details.setKpp(dto.getKpp());
            if (dto.getOgrn() != null) details.setOgrn(dto.getOgrn());
            if (dto.getLegalAddress() != null) details.setLegalAddress(dto.getLegalAddress());
        }
    }
    private boolean hasAny(Object... values) {
        for (Object v : values) {
            if (v != null) return true;
        }
        return false;
    }
}