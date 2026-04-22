package com.hekr.store.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hekr.store.model.individual_details.IndividualDetails;

public interface IndividualDetailsRepository extends JpaRepository<IndividualDetails, Long> {
}
