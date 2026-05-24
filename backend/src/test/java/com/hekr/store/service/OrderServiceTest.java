package com.hekr.store.service;

import com.hekr.store.dto.order.CartCheckoutRequestDto;
import com.hekr.store.dto.order.OrderResponseDto;
import com.hekr.store.dto.order.SingleCheckoutRequestDto;
import com.hekr.store.exceptions.EmptyException;
import com.hekr.store.exceptions.NotEnoughItems;
import com.hekr.store.exceptions.NotFoundException;
import com.hekr.store.mapper.order.CartCheckoutMapper;
import com.hekr.store.mapper.order.OrderResponseMapper;
import com.hekr.store.mapper.order.SimpleOrderResponseMapper;
import com.hekr.store.mapper.order.SingleCheckoutRequestMapper;
import com.hekr.store.model.cart.Cart;
import com.hekr.store.model.order.Order;
import com.hekr.store.model.order.OrderItem;
import com.hekr.store.model.order.OrderStatusHistory;
import com.hekr.store.model.product.Product;
import com.hekr.store.model.product.ProductVariant;
import com.hekr.store.model.stock.Stock;
import com.hekr.store.model.user.User;
import com.hekr.store.model.warehouse.Warehouse;
import com.hekr.store.repository.OrderRepository;
import com.hekr.store.utils.Status;
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
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderResponseMapper orderResponseMapper;

    @Mock
    private CartCheckoutMapper cartCheckoutMapper;

    @Mock
    private WarehouseService warehouseService;

    @Mock
    private UserService userService;

    @Mock
    private CartService cartService;

    @Mock
    private StockService stockService;

    @Mock
    private ProductService productService;

    @Mock
    private SingleCheckoutRequestMapper singleCheckoutRequestMapper;

    @Mock
    private SimpleOrderResponseMapper simpleOrderResponseMapper;

    @Mock
    private UserDetails userDetails;

    @InjectMocks
    private OrderService orderService;

    private User testUser;
    private Warehouse testWarehouse;
    private Product testProduct;
    private ProductVariant testVariant;
    private Stock testStock;
    private Cart testCartItem;
    private Order testOrder;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .login("testuser@example.com")
                .isApproved(true)
                .build();

        testWarehouse = Warehouse.builder()
                .id(100L)
                .build();

        testProduct = Product.builder()
                .id(1000L)
                .title("Тестовый товар")
                .priceRetail(BigDecimal.valueOf(100))
                .priceWholesale(BigDecimal.valueOf(80))
                .wholesaleThreshold(5)
                .build();

        testVariant = ProductVariant.builder()
                .id(10000L)
                .product(testProduct)
                .color("Красный")
                .size("M")
                .build();

        // Исправлено: у Stock нет поля id типа Long, убираем .id()
        testStock = Stock.builder()
                .variant(testVariant)
                .warehouse(testWarehouse)
                .quantity(50)
                .build();

        testCartItem = Cart.builder()
                .productVariant(testVariant)
                .quantity(2)
                .user(testUser)
                .build();

        testOrder = Order.builder()
                .id(100000L)
                .user(testUser)
                .warehouse(testWarehouse)
                .status(Status.NEW)
                .price(BigDecimal.valueOf(200))
                .build();
    }

    @Nested
    @DisplayName("Тесты получения заказов (getOrders)")
    class GetOrdersTests {

        @Test
        @DisplayName("Успешное получение заказов с детальной информацией")
        void getOrders_VerboseTrue_ReturnsDetailedOrders() {
            // Arrange
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userService.findByLogin("testuser@example.com")).thenReturn(testUser);

            List<Order> orders = List.of(testOrder);
            when(orderRepository.findByUserIdVerbose(1L)).thenReturn(orders);

            OrderResponseDto expectedDto = OrderResponseDto.builder().id(100000L).build();
            when(orderResponseMapper.toDtoList(orders)).thenReturn(List.of(expectedDto));

            // Act
            List<?> result = orderService.getOrders(userDetails, true);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result).hasSize(1);
            verify(orderRepository).findByUserIdVerbose(1L);
            verify(orderResponseMapper).toDtoList(orders);
        }

        @Test
        @DisplayName("Успешное получение заказов с простой информацией")
        void getOrders_VerboseFalse_ReturnsSimpleOrders() {
            // Arrange
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userService.findByLogin("testuser@example.com")).thenReturn(testUser);

            List<Order> orders = List.of(testOrder);
            when(orderRepository.findByUserIdSimple(1L)).thenReturn(orders);

            when(simpleOrderResponseMapper.toDtoList(orders)).thenReturn(List.of());

            // Act
            List<?> result = orderService.getOrders(userDetails, false);

            // Assert
            assertThat(result).isNotNull();
            verify(orderRepository).findByUserIdSimple(1L);
            verify(simpleOrderResponseMapper).toDtoList(orders);
        }

        @Test
        @DisplayName("Негативный: аккаунт не подтверждён")
        void getOrders_UserNotApproved_ThrowsDisabledException() {
            // Arrange
            testUser.setIsApproved(false);
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userService.findByLogin("testuser@example.com")).thenReturn(testUser);

            // Act & Assert
            assertThatThrownBy(() -> orderService.getOrders(userDetails, true))
                    .isInstanceOf(DisabledException.class)
                    .hasMessage("Ваш аккаунт ожидает подтверждения администратором");

            verify(orderRepository, never()).findByUserIdVerbose(anyLong());
        }
    }

    @Nested
    @DisplayName("Тесты получения заказа по ID (getOrder)")
    class GetOrderByIdTests {

        @Test
        @DisplayName("Успешное получение заказа по ID")
        void getOrder_Success_ReturnsOrder() {
            // Arrange
            when(orderRepository.findByIdWithItemsAndHistory(100000L)).thenReturn(Optional.of(testOrder));

            OrderResponseDto expectedDto = OrderResponseDto.builder().id(100000L).build();
            when(orderResponseMapper.toDto(testOrder)).thenReturn(expectedDto);

            // Act
            OrderResponseDto result = orderService.getOrder(100000L);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(100000L);
            verify(orderRepository).findByIdWithItemsAndHistory(100000L);
            verify(orderResponseMapper).toDto(testOrder);
        }

        @Test
        @DisplayName("Негативный: заказ не найден")
        void getOrder_OrderNotFound_ThrowsNotFoundException() {
            // Arrange
            when(orderRepository.findByIdWithItemsAndHistory(99999L)).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> orderService.getOrder(99999L))
                    .isInstanceOf(NotFoundException.class)
                    .hasMessage("Заказ не найден");
        }
    }

    @Nested
    @DisplayName("Тесты создания заказа из корзины (createCartOrder)")
    class CreateCartOrderTests {

        private CartCheckoutRequestDto checkoutDto;

        @BeforeEach
        void setUp() {
            checkoutDto = CartCheckoutRequestDto.builder()
                    .warehouseId(100L)
                    .build();
        }

        @Test
        @DisplayName("Успешное создание заказа из корзины")
        void createCartOrder_Success_ReturnsOrder() {
            // Arrange
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userService.findByLogin("testuser@example.com")).thenReturn(testUser);
            when(warehouseService.findById(100L)).thenReturn(testWarehouse);
            when(cartService.findByUserId(1L)).thenReturn(List.of(testCartItem));
            when(stockService.getByVariantIdAndWarehouseId(10000L, 100L)).thenReturn(testStock);
            when(cartCheckoutMapper.toOrder(checkoutDto)).thenReturn(testOrder);
            when(orderRepository.save(any(Order.class))).thenReturn(testOrder);
            doNothing().when(cartService).deleteAll(userDetails);

            OrderResponseDto expectedDto = OrderResponseDto.builder().id(100000L).build();
            when(orderResponseMapper.toDto(testOrder)).thenReturn(expectedDto);

            // Act
            OrderResponseDto result = orderService.createCartOrder(userDetails, checkoutDto);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(100000L);
            assertThat(testStock.getQuantity()).isEqualTo(48);
            verify(stockService).saveStock(testStock);
            verify(orderRepository).save(any(Order.class));
            verify(cartService).deleteAll(userDetails);
        }

        @Test
        @DisplayName("Негативный: корзина пуста")
        void createCartOrder_EmptyCart_ThrowsEmptyException() {
            // Arrange
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userService.findByLogin("testuser@example.com")).thenReturn(testUser);
            when(warehouseService.findById(100L)).thenReturn(testWarehouse);
            when(cartService.findByUserId(1L)).thenReturn(List.of());

            // Act & Assert
            assertThatThrownBy(() -> orderService.createCartOrder(userDetails, checkoutDto))
                    .isInstanceOf(EmptyException.class)
                    .hasMessage("Корзина не должна быть пустой");

            verify(orderRepository, never()).save(any());
        }

        @Test
        @DisplayName("Негативный: недостаточно товара на складе")
        void createCartOrder_NotEnoughStock_ThrowsNotEnoughItems() {
            // Arrange
            testStock.setQuantity(1);

            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userService.findByLogin("testuser@example.com")).thenReturn(testUser);
            when(warehouseService.findById(100L)).thenReturn(testWarehouse);
            when(cartService.findByUserId(1L)).thenReturn(List.of(testCartItem));
            when(stockService.getByVariantIdAndWarehouseId(10000L, 100L)).thenReturn(testStock);

            // Act & Assert
            assertThatThrownBy(() -> orderService.createCartOrder(userDetails, checkoutDto))
                    .isInstanceOf(NotEnoughItems.class)
                    .hasMessage("NotEnoughItems");

            verify(stockService, never()).saveStock(any());
            verify(orderRepository, never()).save(any());
        }

        @Test
        @DisplayName("Негативный: аккаунт не подтверждён")
        void createCartOrder_UserNotApproved_ThrowsDisabledException() {
            // Arrange
            testUser.setIsApproved(false);
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userService.findByLogin("testuser@example.com")).thenReturn(testUser);

            // Act & Assert
            assertThatThrownBy(() -> orderService.createCartOrder(userDetails, checkoutDto))
                    .isInstanceOf(DisabledException.class);

            verify(orderRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("Тесты создания одиночного заказа (createSingleOrder)")
    class CreateSingleOrderTests {

        private SingleCheckoutRequestDto singleDto;

        @BeforeEach
        void setUp() {
            singleDto = SingleCheckoutRequestDto.builder()
                    .warehouseId(100L)
                    .variantId(10000L)
                    .quantity(2)
                    .build();
        }

        @Test
        @DisplayName("Успешное создание одиночного заказа")
        void createSingleOrder_Success_ReturnsOrder() {
            // Arrange
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userService.findByLogin("testuser@example.com")).thenReturn(testUser);
            when(warehouseService.findById(100L)).thenReturn(testWarehouse);
            when(productService.getProductVariantById(10000L)).thenReturn(testVariant);
            when(stockService.getByVariantIdAndWarehouseId(10000L, 100L)).thenReturn(testStock);
            when(singleCheckoutRequestMapper.toOrder(singleDto)).thenReturn(testOrder);
            when(orderRepository.saveAndFlush(any(Order.class))).thenReturn(testOrder);

            OrderResponseDto expectedDto = OrderResponseDto.builder().id(100000L).build();
            when(orderResponseMapper.toDto(testOrder)).thenReturn(expectedDto);

            // Act
            OrderResponseDto result = orderService.createSingleOrder(userDetails, singleDto);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(100000L);
            assertThat(testStock.getQuantity()).isEqualTo(48);
            verify(stockService).saveStock(testStock);
            verify(orderRepository).saveAndFlush(any(Order.class));
        }

        @Test
        @DisplayName("Негативный: недостаточно товара на складе")
        void createSingleOrder_NotEnoughStock_ThrowsNotEnoughItems() {
            // Arrange
            testStock.setQuantity(1);

            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userService.findByLogin("testuser@example.com")).thenReturn(testUser);
            when(warehouseService.findById(100L)).thenReturn(testWarehouse);
            when(productService.getProductVariantById(10000L)).thenReturn(testVariant);
            when(stockService.getByVariantIdAndWarehouseId(10000L, 100L)).thenReturn(testStock);

            // Act & Assert
            assertThatThrownBy(() -> orderService.createSingleOrder(userDetails, singleDto))
                    .isInstanceOf(NotEnoughItems.class)
                    .hasMessage("NotEnoughItems");

            verify(stockService, never()).saveStock(any());
            verify(orderRepository, never()).saveAndFlush(any());
        }

        @Test
        @DisplayName("Негативный: аккаунт не подтверждён")
        void createSingleOrder_UserNotApproved_ThrowsDisabledException() {
            // Arrange
            testUser.setIsApproved(false);
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userService.findByLogin("testuser@example.com")).thenReturn(testUser);

            // Act & Assert
            assertThatThrownBy(() -> orderService.createSingleOrder(userDetails, singleDto))
                    .isInstanceOf(DisabledException.class);

            verify(orderRepository, never()).saveAndFlush(any());
        }
    }
}