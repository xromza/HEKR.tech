package com.hekr.store.service;

import com.hekr.store.dto.cart.CartItemRequestDto;
import com.hekr.store.dto.order.OrderRequestDto;
import com.hekr.store.dto.order.OrderResponseDto;
import com.hekr.store.exceptions.NotEnoughItems;
import com.hekr.store.exceptions.NotFoundException;
import com.hekr.store.interfaces.ItemRequestInterface;
import com.hekr.store.interfaces.UserProvider;
import com.hekr.store.mapper.order.OrderMapper;
import com.hekr.store.mapper.order.OrderResponseMapper;
import com.hekr.store.mapper.order.SimpleOrderResponseMapper;
import com.hekr.store.model.order.Order;
import com.hekr.store.model.product.Product;
import com.hekr.store.model.product.ProductVariant;
import com.hekr.store.model.stock.Stock;
import com.hekr.store.model.user.User;
import com.hekr.store.model.warehouse.Warehouse;
import com.hekr.store.repository.OrderRepository;
import com.hekr.store.utils.Status;
import com.hekr.store.utils.PaymentMethod;
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
import java.util.Map;
import java.util.HashMap;
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
    private OrderMapper orderMapper;

    @Mock
    private WarehouseService warehouseService;

    // Заменили на ваш новый провайдер пользователей
    @Mock
    private UserProvider userProvider;

    @Mock
    private CartService cartService;

    @Mock
    private StockService stockService;

    // Добавили сервис вариантов, который появился в методе
    @Mock
    private ProductVariantService productVariantService;

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

        testStock = Stock.builder()
                .variant(testVariant)
                .warehouse(testWarehouse)
                .quantity(50)
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
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userProvider.getApprovedUserByLogin("testuser@example.com")).thenReturn(testUser);

            List<Order> orders = List.of(testOrder);
            when(orderRepository.findByUserIdVerbose(1L)).thenReturn(orders);

            OrderResponseDto expectedDto = OrderResponseDto.builder().id(100000L).build();
            when(orderResponseMapper.toDtoList(orders)).thenReturn(List.of(expectedDto));

            List<?> result = orderService.getOrders(userDetails, true);

            assertThat(result).isNotNull().hasSize(1);
            verify(orderRepository).findByUserIdVerbose(1L);
        }

        @Test
        @DisplayName("Негативный: аккаунт не подтверждён")
        void getOrders_UserNotApproved_ThrowsDisabledException() {
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userProvider.getApprovedUserByLogin("testuser@example.com"))
                    .thenThrow(new DisabledException("Ваш аккаунт ожидает подтверждения администратором"));

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
            when(orderRepository.findByIdWithItemsAndHistory(100000L)).thenReturn(Optional.of(testOrder));

            OrderResponseDto expectedDto = OrderResponseDto.builder().id(100000L).build();
            when(orderResponseMapper.toDto(testOrder)).thenReturn(expectedDto);

            OrderResponseDto result = orderService.getOrder(100000L);

            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(100000L);
        }

        @Test
        @DisplayName("Негативный: заказ не найден")
        void getOrder_OrderNotFound_ThrowsNotFoundException() {
            when(orderRepository.findByIdWithItemsAndHistory(99999L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> orderService.getOrder(99999L))
                    .isInstanceOf(NotFoundException.class)
                    .hasMessage("Заказ не найден");
        }
    }

    @Nested
    @DisplayName("Тесты создания заказа (createOrder)")
    class CreateOrderTests {

        private OrderRequestDto checkoutDto;
        private List<ItemRequestInterface> requestItems;
        private List<Long> variantIds;

        @BeforeEach
        void setUp() {
            requestItems = List.of(
                    CartItemRequestDto.builder()
                            .variantId(10000L)
                            .quantity(2)
                            .build());
            variantIds = List.of(10000L);

            checkoutDto = OrderRequestDto.builder()
                    .warehouseId(100L)
                    .address("г. Краснодар, ул. Красная, д. 1")
                    .payment(PaymentMethod.CARD)
                    .comment("Быстрее")
                    .items(requestItems)
                    .build();
        }

        @Test
        @DisplayName("Успешное создание заказа")
        void createOrder_Success_ReturnsOrderResponse() {
            // Arrange
            when(warehouseService.findById(100L)).thenReturn(testWarehouse);
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userProvider.getApprovedUserByLogin("testuser@example.com")).thenReturn(testUser);

            Map<Long, Stock> stockMap = new HashMap<>();
            stockMap.put(10000L, testStock);
            when(stockService.getStocksMapByVariantIdsAndWarehouseId(100L, variantIds)).thenReturn(stockMap);

            Map<Long, ProductVariant> variantMap = new HashMap<>();
            variantMap.put(10000L, testVariant);
            when(productVariantService.getAllVariantsByIds(variantIds)).thenReturn(variantMap);

            // Создаем чистый пустой инстанс заказа для симуляции маппера, чтобы в сервисе
            // не вылетал NPE
            Order preSavedOrder = new Order();
            when(orderMapper.toOrder(checkoutDto)).thenReturn(preSavedOrder);
            when(userProvider.getSystem()).thenReturn(User.builder().id(0L).login("system").build());
            when(orderRepository.save(any(Order.class))).thenReturn(testOrder);

            OrderResponseDto expectedDto = OrderResponseDto.builder().id(100000L).build();
            when(orderResponseMapper.toDto(testOrder)).thenReturn(expectedDto);

            // Act
            OrderResponseDto result = orderService.createOrder(userDetails, checkoutDto);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(100000L);
            assertThat(testStock.getQuantity()).isEqualTo(48); // Проверяем успешное списание остатка

            verify(cartService).deleteItems(userDetails, requestItems); // Проверяем удаление именно переданных позиций
            verify(orderRepository).save(any(Order.class));
        }

        @Test
        @DisplayName("Успешное создание заказа с применением оптовой цены")
        void createOrder_WholesalePriceApplied_Success() {
            // Arrange
            requestItems.get(0).setQuantity(10); // Порог опта = 5, ставим 10 штук

            when(warehouseService.findById(100L)).thenReturn(testWarehouse);
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userProvider.getApprovedUserByLogin("testuser@example.com")).thenReturn(testUser);

            Map<Long, Stock> stockMap = new HashMap<>();
            testStock.setQuantity(100); // Чтобы хватило остатков
            stockMap.put(10000L, testStock);
            when(stockService.getStocksMapByVariantIdsAndWarehouseId(100L, variantIds)).thenReturn(stockMap);

            Map<Long, ProductVariant> variantMap = new HashMap<>();
            variantMap.put(10000L, testVariant);
            when(productVariantService.getAllVariantsByIds(variantIds)).thenReturn(variantMap);

            Order preSavedOrder = new Order();
            when(orderMapper.toOrder(checkoutDto)).thenReturn(preSavedOrder);
            when(userProvider.getSystem()).thenReturn(User.builder().id(0L).login("system").build());
            when(orderRepository.save(any(Order.class))).thenReturn(testOrder);

            OrderResponseDto expectedDto = OrderResponseDto.builder().id(100000L).build();
            when(orderResponseMapper.toDto(testOrder)).thenReturn(expectedDto);

            // Act
            orderService.createOrder(userDetails, checkoutDto);

            // Assert
            // 10 штук * 80 (оптовая цена) = 800
            assertThat(preSavedOrder.getPrice()).isEqualByComparingTo(BigDecimal.valueOf(800));
        }

        @Test
        @DisplayName("Негативный: вариант товара отсутствует в мапе (удален)")
        void createOrder_VariantNotFound_ThrowsNotFoundException() {
            // Arrange
            when(warehouseService.findById(100L)).thenReturn(testWarehouse);
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userProvider.getApprovedUserByLogin("testuser@example.com")).thenReturn(testUser);

            Map<Long, Stock> stockMap = new HashMap<>();
            stockMap.put(10000L, testStock);
            when(stockService.getStocksMapByVariantIdsAndWarehouseId(100L, variantIds)).thenReturn(stockMap);

            // Возвращаем пустую мапу вариантов (симулируем, что товара нет в БД)
            when(productVariantService.getAllVariantsByIds(variantIds)).thenReturn(new HashMap<>());

            // Act & Assert
            assertThatThrownBy(() -> orderService.createOrder(userDetails, checkoutDto))
                    .isInstanceOf(NotFoundException.class)
                    .hasMessageContaining("Товар с ID: 10000 больше недоступен");

            verify(orderRepository, never()).save(any());
        }

        @Test
        @DisplayName("Негативный: ошибка валидации остатков")
        void createOrder_ValidationFailed_ThrowsNotEnoughItems() {
            // Arrange
            when(warehouseService.findById(100L)).thenReturn(testWarehouse);
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userProvider.getApprovedUserByLogin("testuser@example.com")).thenReturn(testUser);

            List<Long> variantIds = List.of(10000L);

            Map<Long, ProductVariant> variantMap = new HashMap<>();
            variantMap.put(10000L, testVariant);
            lenient().when(productVariantService.getAllVariantsByIds(variantIds)).thenReturn(variantMap);

            doThrow(new NotEnoughItems("NotEnoughItems", new HashMap<>()))
                    .when(stockService).getStocksMapByVariantIdsAndWarehouseId(anyLong(), any());

            // Act & Assert
            assertThatThrownBy(() -> orderService.createOrder(userDetails, checkoutDto))
                    .isInstanceOf(NotEnoughItems.class);

            verify(orderRepository, never()).save(any());
        }
    }
}