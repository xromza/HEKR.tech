package com.hekr.store.interfaces;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.hekr.store.dto.individual_details.IndividualDetailsRequestDto;
import com.hekr.store.dto.legal_details.LegalDetailsRequestDto;

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type"
)
@JsonSubTypes({
    @JsonSubTypes.Type(value = IndividualDetailsRequestDto.class, name = "INDIVIDUAL"),
    @JsonSubTypes.Type(value = LegalDetailsRequestDto.class, name = "LEGAL")
})
public interface DetailsRequestInterface {
    
}