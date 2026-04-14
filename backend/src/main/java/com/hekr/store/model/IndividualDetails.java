package com.hekr.store.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "individual_details")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class IndividualDetails {
    
    @Id
    @Column(name = "user_id")
    private Long userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "first_name", length = 256, nullable = false)
    private String firstName;

    @Column(name = "last_name", length = 256, nullable = false)
    private String lastName;

    @Column(name = "midname", length = 256)
    private String midName;

    @Column(name = "birthdate", nullable = false)
    private LocalDate birthDate;

    @Column(name = "passport_series", length = 4, nullable = false)
    private String passportSeries;

    @Column(name = "passport_number", length = 6, nullable = false)
    private String passportNumber;
}
