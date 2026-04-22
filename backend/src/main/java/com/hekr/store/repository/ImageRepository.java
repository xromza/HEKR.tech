package com.hekr.store.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hekr.store.model.image.Image;

public interface ImageRepository extends JpaRepository<Image, Long> {

    
}