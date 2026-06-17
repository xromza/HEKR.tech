package com.hekr.store.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hekr.store.model.user.UserToken;

public interface UserTokenRepository extends JpaRepository<UserToken, Long> {
    @Query("SELECT ut FROM UserToken ut WHERE ut.token = :token AND ut.revoked = false")
    Optional<UserToken> findActiveByRefreshToken(String token);

    @Query("SELECT ut FROM UserToken ut JOIN ut.user u WHERE u.id = :userId AND ut.revoked = false")
    List<UserToken> findAllValidTokensByUser(Long userId);
}
