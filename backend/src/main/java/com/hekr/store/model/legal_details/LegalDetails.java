package com.hekr.store.model.legal_details;

import com.hekr.store.model.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "legal_details")

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LegalDetails {
    @Id
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "company_name", length = 256, nullable = false)
    private String companyName;

    @Column(length = 12, nullable = false)
    private String inn;

    @Column(length = 9)
    private String kpp;

    @Column(length = 15, nullable = false)
    private String ogrn;

    @Column(name = "legal_address", length = 256, nullable = false)
    private String legalAddress;

}
