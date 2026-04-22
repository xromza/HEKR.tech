package com.hekr.store.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hekr.store.model.cart.Cart;
import com.hekr.store.model.cart.CartItemId;

import jakarta.transaction.Transactional;

public interface CartRepository extends JpaRepository<Cart, CartItemId> {
    List<Cart> findById_UserId(Long userId);
    Optional<Cart> findById_UserIdAndId_VariantId(Long userId, Long variantId);

    @Transactional
    void deleteById_UserId(Long userId);

    @Transactional
    void deleteById_UserIdAndId_VariantId(Long userId, Long variantId);
}
