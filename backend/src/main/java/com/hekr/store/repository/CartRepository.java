package com.hekr.store.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hekr.store.model.cart.Cart;
import com.hekr.store.model.cart.CartItemId;

import jakarta.transaction.Transactional;

public interface CartRepository extends JpaRepository<Cart, CartItemId> {
    List<Cart> findByIdUserId(Long userId);
    Optional<Cart> findByIdUserIdAndIdVariantId(Long userId, Long variantId);

    Boolean existsByIdUserIdAndIdVariantId(Long userId, Long variantId);

    @Transactional
    void deleteByIdUserId(Long userId);

    @Transactional
    void deleteByIdUserIdAndIdVariantId(Long userId, Long variantId);

    
}
