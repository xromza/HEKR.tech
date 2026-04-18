package com.hekr.store.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hekr.store.model.IndividualDetails;

public interface IndividualDetailsRepository extends JpaRepository<IndividualDetails, Long> {
}
