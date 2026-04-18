package com.hekr.store.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hekr.store.model.LegalDetails;

public interface LegalDetailsRepository extends JpaRepository<LegalDetails, Long> {
}
