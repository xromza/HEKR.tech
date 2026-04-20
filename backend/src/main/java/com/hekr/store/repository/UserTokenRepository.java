package com.hekr.store.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hekr.store.model.UserToken;

public interface UserTokenRepository extends JpaRepository<UserToken, Long> {
    
}
