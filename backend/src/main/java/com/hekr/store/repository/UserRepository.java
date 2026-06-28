package com.hekr.store.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.hekr.store.model.user.User;


public interface UserRepository extends JpaRepository<User, Long> {
    @EntityGraph(attributePaths = {"individualDetails", "legalDetails"})
    Optional<User> findByLogin(String login);

    boolean existsByLogin(String login);
    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);

    List<User> findByIsApproved(Pageable pageable, Boolean isApproved);
}
