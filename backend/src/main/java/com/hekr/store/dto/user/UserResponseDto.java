package com.hekr.store.dto.user;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.hekr.store.dto.individual_details.IndividualDetailsResponseDto;
import com.hekr.store.dto.legal_details.LegalDetailsResponseDto;
import com.hekr.store.interfaces.DetailsResponseInterface;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Schema(description = "Информация о пользователе", example = """
        {
          "id": 1,
          "login": "xromza",
          "role": "CLIENT",
          "createdAt": "2026-04-13T14:00:03",
          "isApproved": true,
          "clientType": "LEGAL",
          "firstName": null,
          "lastName": null,
          "midName": null,
          "birthDate": null,
          "phone": "+7 (999) 123-45-67",
          "email": "ivan.petrov@example.ru",
          "companyName": "ООО ХЕКР БЛОК",
          "inn": "7707083892",
          "kpp": "773601001",
          "ogrn": "1027700132195",
          "legalAddress": "г. Санкт-Петербург ул. Хекровская д. 67"
        }
        """)

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserResponseDto {

    @Schema(description = "Уникальный идентификатор пользователя", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @Schema(description = "Логин пользователя", example = "xromza", accessMode = Schema.AccessMode.READ_ONLY)
    private String login;
    @Schema(description = "Роль пользователя", example = "LEGAL", accessMode = Schema.AccessMode.READ_ONLY)
    private String role;
    @Schema(description = "Время создания аккаунта", example = "2026-04-13T14:00:03", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime createdAt;
    @Schema(description = "Активен ли аккаунт", example = "true", accessMode = Schema.AccessMode.READ_ONLY)
    private Boolean isApproved;

    @Schema(description = "Тип клиента", example = "COMPANY", accessMode = Schema.AccessMode.READ_ONLY)
    private String clientType;
    private String email;
    private String phone;
    
    @Schema(oneOf = { IndividualDetailsResponseDto.class, LegalDetailsResponseDto.class })
    DetailsResponseInterface details;
}
