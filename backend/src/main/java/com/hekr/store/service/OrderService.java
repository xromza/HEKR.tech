package com.hekr.store.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hekr.store.dto.cart.CartItemRequestDto;
import com.hekr.store.dto.order.OrderRequestDto;
import com.hekr.store.dto.order.OrderResponseDto;
import com.hekr.store.dto.order.OrderStatusHistoryResponseDto;
import com.hekr.store.exceptions.EmptyException;
import com.hekr.store.exceptions.NotEnoughItems;
import com.hekr.store.exceptions.NotFoundException;
import com.hekr.store.interfaces.OrderDtoInterface;
import com.hekr.store.interfaces.UserProvider;
import com.hekr.store.mapper.order.OrderMapper;
import com.hekr.store.mapper.order.OrderResponseMapper;
import com.hekr.store.mapper.order.OrderStatusHistoryMapper;
import com.hekr.store.mapper.order.SimpleOrderResponseMapper;
import com.hekr.store.model.order.Order;
import com.hekr.store.model.order.OrderItem;
import com.hekr.store.model.order.OrderStatusHistory;
import com.hekr.store.model.product.Product;
import com.hekr.store.model.product.ProductVariant;
import com.hekr.store.model.stock.Stock;
import com.hekr.store.model.user.User;
import com.hekr.store.model.warehouse.Warehouse;
import com.hekr.store.repository.OrderRepository;
import com.hekr.store.repository.OrderStatusHistoryRepository;
import com.hekr.store.utils.Status;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderResponseMapper orderResponseMapper;
    private final UserProvider userProvider;
    private final CartService cartService;
    private final StockService stockService;
    private final WarehouseService warehouseService;
    private final ProductVariantService productVariantService;
    private final SimpleOrderResponseMapper simpleOrderResponseMapper;
    private final OrderStatusHistoryRepository orderStatusHistoryRepository;
    private final OrderStatusHistoryMapper orderStatusHistoryMapper;
    private final OrderMapper orderMapper;

    private Order findById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Заказ не найден"));
    }

    @Transactional(readOnly = true)
    public List<? extends OrderDtoInterface> getOrders(UserDetails userDetails, boolean verbose) {
        String login = userDetails.getUsername();

        User user = userProvider.getApprovedUserByLogin(login);

        if (verbose)
            return orderResponseMapper.toDtoList(orderRepository.findByUserIdVerbose(user.getId()));
        else
            return simpleOrderResponseMapper.toDtoList(orderRepository.findByUserIdSimple(user.getId()));
    }

    public OrderResponseDto getOrder(Long id) {
        Order order = orderRepository.findByIdWithItemsAndHistory(id)
                .orElseThrow(() -> new NotFoundException("Заказ не найден"));

        return orderResponseMapper.toDto(order);
    }


    @Transactional
    public OrderResponseDto createOrder(UserDetails userDetails, OrderRequestDto dto) {
        Warehouse warehouse = warehouseService.findById(dto.getWarehouseId());
        User user = userProvider.getApprovedUserByLogin(userDetails.getUsername());
        List<CartItemRequestDto> items = dto.getItems();
        List<Long> ids = items.stream().map(CartItemRequestDto::getVariantId).toList();
        Map<Long, Stock> stocks = stockService.getStocksMapByVariantIds(dto.getWarehouseId(), ids);
        Map<Long, ProductVariant> variants = productVariantService.getAllVariantsByIds(ids);
        validateStock(stocks, items);

        Order order = orderMapper.toOrder(dto);
        BigDecimal orderTotal = BigDecimal.ZERO;
        for (CartItemRequestDto item : items) {
            ProductVariant variant = variants.get(item.getVariantId());
            if (variant == null) {
                throw new NotFoundException("Товар с ID: " + item.getVariantId() + " больше недоступен");
            }
            Product product = variant.getProduct();
            BigDecimal priceAtPurchase = item.getQuantity() >= product.getWholesaleThreshold()
                    ? product.getPriceWholesale()
                    : product.getPriceRetail();
            BigDecimal totalPrice = BigDecimal.valueOf(item.getQuantity()).multiply(priceAtPurchase);
            Stock stock = stocks.get(item.getVariantId());
            stock.setQuantity(stock.getQuantity() - item.getQuantity());
            OrderItem orderItem = OrderItem.builder()
                    .productVariant(variant)
                    .quantity(item.getQuantity())
                    .priceAtPurchase(priceAtPurchase)
                    .totalPrice(totalPrice)
                    .build();
            orderTotal = orderTotal.add(totalPrice);
            order.addItem(orderItem);
        }
        order.setStatus(Status.NEW);
        order.setUser(user);
        order.setPrice(orderTotal);
        order.setWarehouse(warehouse);
        order.setDate(LocalDateTime.now());

        OrderStatusHistory orderStatusHistory = OrderStatusHistory.builder()
                .changedBy(userProvider.getSystem())
                .newStatus(Status.NEW)
                .changedAt(LocalDateTime.now())
                .order(order)
                .comment("Заказ создан")
                .build();
        order.addHistory(orderStatusHistory);
        Order saved = orderRepository.save(order);

        cartService.deleteItems(userDetails, items);
        return orderResponseMapper.toDto(saved);
    }

    public void validateStock(Map<Long, Stock> stocks, List<CartItemRequestDto> items) {
        if (items.isEmpty()) {
            throw new EmptyException("Заказ не может быть пустым");
        }
        Map<Long, String> errors = new HashMap<>();
        boolean canCheckout = true;
        for (CartItemRequestDto item : items) {
            Stock stock = stocks.get(item.getVariantId());
            if (stock.getQuantity() < item.getQuantity()) {
                canCheckout = false;
                errors.put(item.getVariantId(), "Недостаточно товара. Доступно: " + stock.getQuantity());
            }
        }
        if (!canCheckout) {
            throw new NotEnoughItems("NotEnoughItems", errors);
        }
    }

    @Transactional
    public OrderStatusHistoryResponseDto updateStatus(UserDetails userDetails, Long orderId, Status status,
            String comment) {
        String login = userDetails.getUsername();
        User user = userProvider.getApprovedUserByLogin(login);
        Order order = findById(orderId);

        OrderStatusHistory orderStatusHistory = OrderStatusHistory.builder()
                .newStatus(status)
                .changedAt(LocalDateTime.now())
                .changedBy(user)
                .comment(comment)
                .order(order)
                .build();
        return orderStatusHistoryMapper.toDto(orderStatusHistoryRepository.save(orderStatusHistory));
    }
}