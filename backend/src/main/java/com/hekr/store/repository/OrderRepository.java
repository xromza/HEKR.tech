package com.hekr.store.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hekr.store.model.order.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Page<Order> findAll(Pageable pageable);
    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.items WHERE o.id = :id")
    Optional<Order> findByIdWithItems(Long id);

    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.items LEFT JOIN FETCH o.history WHERE o.id = :id")
    Optional<Order> findByIdWithItemsAndHistory(Long id);

    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.items LEFT JOIN FETCH o.user WHERE o.id = :id")
    Optional<Order> findByIdWithItemsAndUser(Long id);

    @Query("SELECT DISTINCT o FROM Order o WHERE o.user.id = :userId")
    @EntityGraph(attributePaths = { "items", "history", "user" })
    List<Order> findByUserIdVerbose(Long userId);

    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.items WHERE o.user.id = :userId")
    List<Order> findByUserIdWithItems(Long userId);

    @Query("SELECT DISTINCT o FROM Order o WHERE o.user.id = :userId")
    List<Order> findByUserIdSimple(Long userId);

    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.items LEFT JOIN FETCH o.history WHERE o.user.id = :userId")
    List<Order> findByUserIdWithItemsAndHistory(Long userId);
}
