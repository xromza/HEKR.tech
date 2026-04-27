package com.hekr.store.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hekr.store.dto.cart.CartItemRequestDto;
import com.hekr.store.dto.cart.CartItemResponseDto;
import com.hekr.store.dto.cart.CartResponseDto;
import com.hekr.store.mapper.cart.CartItemResponseMapper;
import com.hekr.store.model.cart.Cart;
import com.hekr.store.model.cart.CartItemId;
import com.hekr.store.model.category.Category;
import com.hekr.store.model.product.Product;
import com.hekr.store.model.product.ProductVariant;
import com.hekr.store.model.user.User;
import com.hekr.store.repository.CartRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final UserService userService;
    private final ProductService productService;
    private final CartItemResponseMapper cartItemResponseMapper;

    public CartResponseDto getCart(UserDetails userDetails) {
        User user = userService.findByLogin(userDetails.getUsername());
        List<Cart> cart = cartRepository.findByIdUserId(user.getId());
        List<CartItemResponseDto> cartItems = cartItemResponseMapper.toResponseList(cart);

        boolean canCheckout = cartItems.stream().allMatch(c -> c.getAvailableStock() >= c.getQuantity());

        BigDecimal totalPrice = cart.stream().map(c -> {
            boolean isWholesale = c.getQuantity() >= c.getProductVariant().getProduct().getWholesaleThreshold();

            ProductVariant variant = c.getProductVariant();
            Product product = variant.getProduct();

            BigDecimal price = isWholesale
                    ? product.getPriceWholesale()
                    : product.getPriceRetail();

            return price.multiply(BigDecimal.valueOf(c.getQuantity()));

        }).reduce(BigDecimal.ZERO, BigDecimal::add);

        boolean discountApplied = cart.stream().anyMatch(c -> {
            Category category = c.getProductVariant().getProduct().getCategory();

            if (category == null || category.getDiscount() == null) {
                return false;
            }

            return category.getDiscount().getDiscount().compareTo(BigDecimal.ZERO) > 0;
        });

        return CartResponseDto.builder()
                .can_checkout(canCheckout)
                .discount_applied(discountApplied)
                .total_price(totalPrice)
                .items(cartItems)
                .build();

    }

    @Transactional
    public CartItemResponseDto addOrUpdateItem(UserDetails userDetails, CartItemRequestDto cartItemRequestDto) {
        User user = userService.findByLogin(userDetails.getUsername());
        ProductVariant variant = productService.getProductVariantById(cartItemRequestDto.getVariantId());
        CartItemId id = CartItemId
                .builder()
                .userId(user.getId())
                .variantId(cartItemRequestDto.getVariantId())
                .build();
        Cart cartItem = Cart.builder()
                .productVariant(variant)
                .quantity(cartItemRequestDto.getQuantity())
                .user(user)
                .id(id)
                .build();
        Cart saved = cartRepository.save(cartItem);
        return cartItemResponseMapper.toDto(saved);

    }

    @Transactional
    public void deleteItem(UserDetails userDetails, Long variantId) {
        User user = userService.findByLogin(userDetails.getUsername());
        cartRepository.deleteByIdUserIdAndIdVariantId(user.getId(), variantId);
    }

    @Transactional 
    public void deleteAll(UserDetails userDetails) {
        User user = userService.findByLogin(userDetails.getUsername());
        cartRepository.deleteByIdUserId(user.getId());
    }
}
