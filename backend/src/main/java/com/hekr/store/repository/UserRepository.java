package com.hekr.store.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hekr.store.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    
}
