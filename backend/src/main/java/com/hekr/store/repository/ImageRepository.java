package com.hekr.store.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hekr.store.model.Image;

public interface ImageRepository extends JpaRepository<Image, Long> {

    
}