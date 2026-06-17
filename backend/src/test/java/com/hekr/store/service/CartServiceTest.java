package com.hekr.store.service;

import com.hekr.store.dto.cart.CartItemRequestDto;
import com.hekr.store.dto.cart.CartItemResponseDto;
import com.hekr.store.dto.cart.CartResponseDto;
import com.hekr.store.exceptions.NotFoundException;
import com.hekr.store.interfaces.UserProvider;
import com.hekr.store.mapper.cart.CartItemResponseMapper;
import com.hekr.store.model.cart.Cart;
import com.hekr.store.model.cart.CartItemId;
import com.hekr.store.model.product.Product;
import com.hekr.store.model.product.ProductVariant;
import com.hekr.store.model.user.User;
import com.hekr.store.repository.CartRepository;
import com.hekr.store.repository.ProductVariantsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UserDetails;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private UserProvider userProvider;

    @Mock
    private ProductVariantsRepository productVariantsRepository;

    @Mock
    private CartItemResponseMapper cartItemResponseMapper;

    @Mock
    private UserDetails userDetails;

    @InjectMocks
    private CartService cartService;

    private User testUser;
    private Product testProduct;
    private ProductVariant testVariant;
    private Cart testCartItem;
    private CartItemRequestDto requestDto;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .login("testuser@example.com")
                .isApproved(true)
                .build();

        testProduct = Product.builder()
                .id(100L)
                .title("Бомбер")
                .priceRetail(BigDecimal.valueOf(1000))
                .priceWholesale(BigDecimal.valueOf(800))
                .wholesaleThreshold(5)
                .build();

        testVariant = ProductVariant.builder()
                .id(1000L)
                .product(testProduct)
                .color("Черный")
                .size("M")
                .build();

        testCartItem = Cart.builder()
                .id(new CartItemId(1L, 1000L))
                .user(testUser)
                .productVariant(testVariant)
                .quantity(2)
                .build();

        requestDto = CartItemRequestDto.builder()
                .variantId(1000L)
                .quantity(2)
                .build();
    }

    @Nested
    @DisplayName("Тесты получения корзины (getCart)")
    class GetCartTests {

        @BeforeEach
        void init() {
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userProvider.getApprovedUserByLogin("testuser@example.com")).thenReturn(testUser);
        }

        @Test
        @DisplayName("Успешное получение корзины")
        void getCart_Success_ReturnsCartWithItems() {
            List<Cart> cartList = List.of(testCartItem);
            when(cartRepository.findByIdUserId(1L)).thenReturn(cartList);

            CartItemResponseDto itemDto = CartItemResponseDto.builder()
                    .variantId(1000L)
                    .quantity(2L)
                    .availableStock(10)
                    .build();
            when(cartItemResponseMapper.toResponseList(cartList)).thenReturn(List.of(itemDto));

            CartResponseDto result = cartService.getCart(userDetails);

            assertThat(result).isNotNull();
            assertThat(result.getCanCheckout()).isTrue();
            assertThat(result.getTotalPrice()).isEqualByComparingTo(BigDecimal.valueOf(2000)); // 2 * 1000
        }

        @Test
        @DisplayName("Применение оптовой цены")
        void getCart_QuantityAboveWholesaleThreshold_UsesWholesalePrice() {
            testCartItem.setQuantity(6); // порог 5
            List<Cart> cartList = List.of(testCartItem);
            when(cartRepository.findByIdUserId(1L)).thenReturn(cartList);

            CartItemResponseDto itemDto = CartItemResponseDto.builder().quantity(6L).availableStock(10).build();
            when(cartItemResponseMapper.toResponseList(cartList)).thenReturn(List.of(itemDto));

            CartResponseDto result = cartService.getCart(userDetails);

            assertThat(result.getTotalPrice()).isEqualByComparingTo(BigDecimal.valueOf(4800)); // 6 * 800
        }

        @Test
        @DisplayName("Негативный: пользователь не подтвержден")
        void getCart_UserNotApproved_ThrowsDisabledException() {
            reset(userProvider); // Сбрасываем дефолтный mock из BeforeEach для теста ошибки
            when(userProvider.getApprovedUserByLogin(any()))
                    .thenThrow(new DisabledException("Аккаунт не подтвержден"));

            assertThatThrownBy(() -> cartService.getCart(userDetails))
                    .isInstanceOf(DisabledException.class);
        }
    }

    @Nested
    @DisplayName("Тесты добавления/обновления товара (addOrUpdateItem)")
    class AddOrUpdateItemTests {

        @Test
        @DisplayName("Успешное добавление товара")
        void addOrUpdateItem_Success_AddsItemToCart() {
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userProvider.getApprovedUserByLogin("testuser@example.com")).thenReturn(testUser);
            when(productVariantsRepository.findById(1000L)).thenReturn(Optional.of(testVariant));
            when(cartRepository.save(any(Cart.class))).thenReturn(testCartItem);

            CartItemResponseDto expected = CartItemResponseDto.builder().variantId(1000L).build();
            when(cartItemResponseMapper.toDto(any(Cart.class))).thenReturn(expected);

            CartItemResponseDto result = cartService.addOrUpdateItem(userDetails, requestDto);

            assertThat(result).isNotNull();
            verify(cartRepository).save(any(Cart.class));
        }

        @Test
        @DisplayName("Негативный: вариант товара не найден")
        void addOrUpdateItem_VariantNotFound_ThrowsNotFoundException() {
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userProvider.getApprovedUserByLogin("testuser@example.com")).thenReturn(testUser);
            when(productVariantsRepository.findById(1000L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> cartService.addOrUpdateItem(userDetails, requestDto))
                    .isInstanceOf(NotFoundException.class)
                    .hasMessageContaining("Вариант товара не найден");
        }
    }

    @Nested
    @DisplayName("Тесты удаления товара (deleteItem)")
    class DeleteItemTests {

        @Test
        @DisplayName("Успешное удаление одной позиции")
        void deleteItem_Success_RemovesItem() {
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userProvider.getApprovedUserByLogin("testuser@example.com")).thenReturn(testUser);

            cartService.deleteItem(userDetails, 1000L);

            verify(cartRepository).deleteByIdUserIdAndIdVariantId(1L, 1000L);
        }
    }

    @Nested
    @DisplayName("Тесты очистки всей корзины (deleteAll)")
    class DeleteAllTests {

        @Test
        @DisplayName("Успешная очистка всей корзины")
        void deleteAll_Success_ClearsAllItems() {
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userProvider.getApprovedUserByLogin("testuser@example.com")).thenReturn(testUser);

            cartService.deleteAll(userDetails);

            verify(cartRepository).deleteByIdUserId(1L);
        }
    }
}