package com.hekr.store.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hekr.store.model.category.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findAllByIdIn(Collection<Long> ids);

    @Query("SELECT c FROM Category c LEFT JOIN FETCH c.discount WHERE c.id = :id")
    Optional<Category> findByIdWithDiscount(Long id);
    Boolean existsByName(String name);
}
