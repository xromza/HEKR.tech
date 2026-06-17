package com.hekr.store.service;

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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UserDetails;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private UserService userService;

    @Mock
    private ProductService productService;

    @Mock
    private CartItemResponseMapper cartItemResponseMapper;

    @Mock
    private UserDetails userDetails;

    @InjectMocks
    private CartService cartService;

    private User testUser;
    private Product testProduct;
    private ProductVariant testVariant;
    private Category testCategory;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .login("testuser@example.com")
                .isApproved(true)
                .build();

        testCategory = Category.builder()
                .id(10L)
                .build();

        testProduct = Product.builder()
                .id(100L)
                .priceRetail(BigDecimal.valueOf(100.00))
                .priceWholesale(BigDecimal.valueOf(80.00))
                .wholesaleThreshold(5)
                .category(testCategory)
                .build();

        testVariant = ProductVariant.builder()
                .id(1000L)
                .product(testProduct)
                .build();
    }

    @Nested
    @DisplayName("Тесты получения корзины (getCart)")
    class GetCartTests {

        @Test
        @DisplayName("Успешное получение корзины с товарами")
        void getCart_Success_ReturnsCartWithItems() {
            // Arrange
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userService.findByLogin("testuser@example.com")).thenReturn(testUser);

            Cart cartItem = createCartItem(testUser, testVariant, 3);
            List<Cart> cartItems = List.of(cartItem);
            when(cartRepository.findByIdUserId(1L)).thenReturn(cartItems);

            CartItemResponseDto responseDto = createCartItemResponseDto(1000L, 3L, 50);
            when(cartItemResponseMapper.toResponseList(cartItems)).thenReturn(List.of(responseDto));

            // Act
            CartResponseDto result = cartService.getCart(userDetails);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getCan_checkout()).isTrue();
            assertThat(result.getTotal_price()).isEqualByComparingTo(BigDecimal.valueOf(300.00));
            assertThat(result.getItems()).hasSize(1);
            assertThat(result.getItems().get(0).getVariantId()).isEqualTo(1000L);
            assertThat(result.getItems().get(0).getQuantity()).isEqualTo(3L);

            verify(cartRepository).findByIdUserId(1L);
            verify(cartItemResponseMapper).toResponseList(cartItems);
        }

        @Test
        @DisplayName("Успешное получение пустой корзины")
        void getCart_EmptyCart_ReturnsEmptyItems() {
            // Arrange
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userService.findByLogin("testuser@example.com")).thenReturn(testUser);
            when(cartRepository.findByIdUserId(1L)).thenReturn(List.of());
            when(cartItemResponseMapper.toResponseList(List.of())).thenReturn(List.of());

            // Act
            CartResponseDto result = cartService.getCart(userDetails);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getCan_checkout()).isTrue();
            assertThat(result.getTotal_price()).isEqualByComparingTo(BigDecimal.ZERO);
            assertThat(result.getItems()).isEmpty();
            assertThat(result.getDiscount_applied()).isFalse();
        }

        @Test
        @DisplayName("Корзина с оптовой ценой при превышении порога")
        void getCart_QuantityAboveWholesaleThreshold_UsesWholesalePrice() {
            // Arrange
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userService.findByLogin("testuser@example.com")).thenReturn(testUser);

            Cart cartItem = createCartItem(testUser, testVariant, 10);
            when(cartRepository.findByIdUserId(1L)).thenReturn(List.of(cartItem));
            when(cartItemResponseMapper.toResponseList(any())).thenReturn(new ArrayList<>());

            // Act
            CartResponseDto result = cartService.getCart(userDetails);

            // Assert
            assertThat(result.getTotal_price()).isEqualByComparingTo(BigDecimal.valueOf(800.00));
        }

        @Test
        @DisplayName("Корзина с розничной ценой при количестве ниже порога")
        void getCart_QuantityBelowWholesaleThreshold_UsesRetailPrice() {
            // Arrange
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userService.findByLogin("testuser@example.com")).thenReturn(testUser);

            Cart cartItem = createCartItem(testUser, testVariant, 3);
            when(cartRepository.findByIdUserId(1L)).thenReturn(List.of(cartItem));
            when(cartItemResponseMapper.toResponseList(any())).thenReturn(new ArrayList<>());

            // Act
            CartResponseDto result = cartService.getCart(userDetails);

            // Assert
            assertThat(result.getTotal_price()).isEqualByComparingTo(BigDecimal.valueOf(300.00));
        }

        @Test
        @DisplayName("Невозможно оформить заказ если количество превышает доступный склад")
        void getCart_QuantityExceedsStock_CannotCheckout() {
            // Arrange
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userService.findByLogin("testuser@example.com")).thenReturn(testUser);

            Cart cartItem = createCartItem(testUser, testVariant, 60);
            when(cartRepository.findByIdUserId(1L)).thenReturn(List.of(cartItem));

            // IMPORTANT: availableStock = 50, quantity = 60 → cannot checkout
            CartItemResponseDto responseDto = createCartItemResponseDto(1000L, 60L, 50);
            when(cartItemResponseMapper.toResponseList(any())).thenReturn(List.of(responseDto));

            // Act
            CartResponseDto result = cartService.getCart(userDetails);

            // Assert
            assertThat(result.getCan_checkout()).isFalse();
        }

        @Test
        @DisplayName("Сумма корзины с несколькими товарами рассчитывается правильно")
        void getCart_MultipleItems_CalculatesTotalPriceCorrectly() {
            // Arrange
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userService.findByLogin("testuser@example.com")).thenReturn(testUser);

            ProductVariant variant2 = ProductVariant.builder()
                    .id(2000L)
                    .product(testProduct)
                    .build();

            Cart item1 = createCartItem(testUser, testVariant, 3);
            Cart item2 = createCartItem(testUser, variant2, 7);

            when(cartRepository.findByIdUserId(1L)).thenReturn(List.of(item1, item2));
            when(cartItemResponseMapper.toResponseList(any())).thenReturn(new ArrayList<>());

            // Act
            CartResponseDto result = cartService.getCart(userDetails);

            // Assert
            assertThat(result.getTotal_price()).isEqualByComparingTo(BigDecimal.valueOf(860.00));
        }

        @Test
        @DisplayName("Негативный: аккаунт не подтверждён - выброс DisabledException")
        void getCart_UserNotApproved_ThrowsDisabledException() {
            // Arrange
            testUser.setIsApproved(false);
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userService.findByLogin("testuser@example.com")).thenReturn(testUser);

            // Act & Assert
            assertThatThrownBy(() -> cartService.getCart(userDetails))
                    .isInstanceOf(DisabledException.class)
                    .hasMessage("Ваш аккаунт ожидает подтверждения администратором");

            verify(cartRepository, never()).findByIdUserId(anyLong());
        }
    }

    @Nested
    @DisplayName("Тесты добавления/обновления товара (addOrUpdateItem)")
    class AddOrUpdateItemTests {

        @Test
        @DisplayName("Успешное добавление товара в корзину")
        void addOrUpdateItem_Success_AddsItemToCart() {
            // Arrange
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userService.findByLogin("testuser@example.com")).thenReturn(testUser);

            CartItemRequestDto request = CartItemRequestDto.builder()
                    .variantId(1000L)
                    .quantity(2)
                    .build();

            when(productService.getProductVariantById(1000L)).thenReturn(testVariant);

            Cart savedCart = createCartItem(testUser, testVariant, 2);
            when(cartRepository.save(any(Cart.class))).thenReturn(savedCart);

            CartItemResponseDto expectedResponse = createCartItemResponseDto(1000L, 2L, 50);
            when(cartItemResponseMapper.toDto(savedCart)).thenReturn(expectedResponse);

            // Act
            CartItemResponseDto result = cartService.addOrUpdateItem(userDetails, request);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getVariantId()).isEqualTo(1000L);
            assertThat(result.getQuantity()).isEqualTo(2L);

            ArgumentCaptor<Cart> cartCaptor = ArgumentCaptor.forClass(Cart.class);
            verify(cartRepository).save(cartCaptor.capture());
            Cart capturedCart = cartCaptor.getValue();
            assertThat(capturedCart.getUser().getId()).isEqualTo(1L);
            assertThat(capturedCart.getProductVariant().getId()).isEqualTo(1000L);
            assertThat(capturedCart.getQuantity()).isEqualTo(2);

            verify(productService).getProductVariantById(1000L);
            verify(cartItemResponseMapper).toDto(savedCart);
        }

        @Test
        @DisplayName("Успешное обновление количества существующего товара")
        void addOrUpdateItem_Success_UpdatesExistingItem() {
            // Arrange
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userService.findByLogin("testuser@example.com")).thenReturn(testUser);

            CartItemRequestDto request = CartItemRequestDto.builder()
                    .variantId(1000L)
                    .quantity(10)
                    .build();

            when(productService.getProductVariantById(1000L)).thenReturn(testVariant);

            Cart updatedCart = createCartItem(testUser, testVariant, 10);
            when(cartRepository.save(any(Cart.class))).thenReturn(updatedCart);

            CartItemResponseDto expectedResponse = createCartItemResponseDto(1000L, 10L, 50);
            when(cartItemResponseMapper.toDto(updatedCart)).thenReturn(expectedResponse);

            // Act
            CartItemResponseDto result = cartService.addOrUpdateItem(userDetails, request);

            // Assert
            assertThat(result.getQuantity()).isEqualTo(10L);

            ArgumentCaptor<Cart> cartCaptor = ArgumentCaptor.forClass(Cart.class);
            verify(cartRepository).save(cartCaptor.capture());
            assertThat(cartCaptor.getValue().getQuantity()).isEqualTo(10);
        }

        @Test
        @DisplayName("Edge-case: добавление товара с нулевым количеством")
        void addOrUpdateItem_ZeroQuantity_SavesWithZero() {
            // Arrange
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userService.findByLogin("testuser@example.com")).thenReturn(testUser);

            CartItemRequestDto request = CartItemRequestDto.builder()
                    .variantId(1000L)
                    .quantity(0)
                    .build();

            when(productService.getProductVariantById(1000L)).thenReturn(testVariant);

            Cart cartWithZero = createCartItem(testUser, testVariant, 0);
            when(cartRepository.save(any(Cart.class))).thenReturn(cartWithZero);

            CartItemResponseDto expectedResponse = createCartItemResponseDto(1000L, 0L, 50);
            when(cartItemResponseMapper.toDto(cartWithZero)).thenReturn(expectedResponse);

            // Act
            CartItemResponseDto result = cartService.addOrUpdateItem(userDetails, request);

            // Assert
            assertThat(result.getQuantity()).isZero();

            ArgumentCaptor<Cart> cartCaptor = ArgumentCaptor.forClass(Cart.class);
            verify(cartRepository).save(cartCaptor.capture());
            assertThat(cartCaptor.getValue().getQuantity()).isZero();
        }

        @Test
        @DisplayName("Негативный: аккаунт не подтверждён - выброс DisabledException")
        void addOrUpdateItem_UserNotApproved_ThrowsDisabledException() {
            // Arrange
            testUser.setIsApproved(false);
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userService.findByLogin("testuser@example.com")).thenReturn(testUser);

            CartItemRequestDto request = CartItemRequestDto.builder()
                    .variantId(1000L)
                    .quantity(2)
                    .build();

            // Act & Assert
            assertThatThrownBy(() -> cartService.addOrUpdateItem(userDetails, request))
                    .isInstanceOf(DisabledException.class)
                    .hasMessage("Ваш аккаунт ожидает подтверждения администратором");

            verify(productService, never()).getProductVariantById(anyLong());
            verify(cartRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("Тесты удаления товара (deleteItem)")
    class DeleteItemTests {

        @Test
        @DisplayName("Успешное удаление товара из корзины")
        void deleteItem_Success_RemovesItem() {
            // Arrange
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userService.findByLogin("testuser@example.com")).thenReturn(testUser);

            // Act
            cartService.deleteItem(userDetails, 1000L);

            // Assert
            verify(cartRepository).deleteByIdUserIdAndIdVariantId(1L, 1000L);
        }

        @Test
        @DisplayName("Edge-case: попытка удалить несуществующий товар")
        void deleteItem_NonExistentItem_DoesNothing() {
            // Arrange
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userService.findByLogin("testuser@example.com")).thenReturn(testUser);

            doNothing().when(cartRepository).deleteByIdUserIdAndIdVariantId(1L, 9999L);

            // Act
            cartService.deleteItem(userDetails, 9999L);

            // Assert
            verify(cartRepository).deleteByIdUserIdAndIdVariantId(1L, 9999L);
        }

        @Test
        @DisplayName("Негативный: аккаунт не подтверждён - выброс DisabledException")
        void deleteItem_UserNotApproved_ThrowsDisabledException() {
            // Arrange
            testUser.setIsApproved(false);
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userService.findByLogin("testuser@example.com")).thenReturn(testUser);

            // Act & Assert
            assertThatThrownBy(() -> cartService.deleteItem(userDetails, 1000L))
                    .isInstanceOf(DisabledException.class)
                    .hasMessage("Ваш аккаунт ожидает подтверждения администратором");

            verify(cartRepository, never()).deleteByIdUserIdAndIdVariantId(anyLong(), anyLong());
        }
    }

    @Nested
    @DisplayName("Тесты очистки всей корзины (deleteAll)")
    class DeleteAllTests {

        @Test
        @DisplayName("Успешная очистка всей корзины")
        void deleteAll_Success_ClearsAllItems() {
            // Arrange
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userService.findByLogin("testuser@example.com")).thenReturn(testUser);

            // Act
            cartService.deleteAll(userDetails);

            // Assert
            verify(cartRepository).deleteByIdUserId(1L);
        }

        @Test
        @DisplayName("Edge-case: очистка уже пустой корзины")
        void deleteAll_EmptyCart_DoesNothing() {
            // Arrange
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userService.findByLogin("testuser@example.com")).thenReturn(testUser);

            doNothing().when(cartRepository).deleteByIdUserId(1L);

            // Act
            cartService.deleteAll(userDetails);

            // Assert
            verify(cartRepository).deleteByIdUserId(1L);
        }

        @Test
        @DisplayName("Негативный: аккаунт не подтверждён - выброс DisabledException")
        void deleteAll_UserNotApproved_ThrowsDisabledException() {
            // Arrange
            testUser.setIsApproved(false);
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userService.findByLogin("testuser@example.com")).thenReturn(testUser);

            // Act & Assert
            assertThatThrownBy(() -> cartService.deleteAll(userDetails))
                    .isInstanceOf(DisabledException.class)
                    .hasMessage("Ваш аккаунт ожидает подтверждения администратором");

            verify(cartRepository, never()).deleteByIdUserId(anyLong());
        }
    }

    @Nested
    @DisplayName("Тесты прямого поиска по userId (findByUserId)")
    class FindByUserIdTests {

        @Test
        @DisplayName("Успешный поиск корзины по userId")
        void findByUserId_Success_ReturnsCartList() {
            // Arrange
            List<Cart> expectedCarts = List.of(
                    createCartItem(testUser, testVariant, 2),
                    createCartItem(testUser, testVariant, 3));
            when(cartRepository.findByIdUserId(1L)).thenReturn(expectedCarts);

            // Act
            List<Cart> result = cartService.findByUserId(1L);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result).hasSize(2);
            assertThat(result).isEqualTo(expectedCarts);
            verify(cartRepository).findByIdUserId(1L);
        }

        @Test
        @DisplayName("Edge-case: поиск по userId без товаров")
        void findByUserId_NoItems_ReturnsEmptyList() {
            // Arrange
            when(cartRepository.findByIdUserId(999L)).thenReturn(List.of());

            // Act
            List<Cart> result = cartService.findByUserId(999L);

            // Assert
            assertThat(result).isEmpty();
            verify(cartRepository).findByIdUserId(999L);
        }
    }

    // ==================== Helper Methods ====================

    private Cart createCartItem(User user, ProductVariant variant, int quantity) {
        CartItemId id = CartItemId.builder()
                .userId(user.getId())
                .variantId(variant.getId())
                .build();

        return Cart.builder()
                .id(id)
                .user(user)
                .productVariant(variant)
                .quantity(quantity)
                .build();
    }

    private CartItemResponseDto createCartItemResponseDto(Long variantId, Long quantity, Integer availableStock) {
        return CartItemResponseDto.builder()
                .variantId(variantId)
                .quantity(quantity)
                .availableStock(availableStock)
                .build();
    }
}