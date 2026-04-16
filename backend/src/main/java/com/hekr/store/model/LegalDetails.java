package com.hekr.store.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "legal_details")

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LegalDetails {
    @Id
    private Long id;

    @OneToOne
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
