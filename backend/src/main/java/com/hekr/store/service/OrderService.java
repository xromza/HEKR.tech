package com.hekr.store.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hekr.store.dto.order.CartCheckoutRequestDto;
import com.hekr.store.dto.order.OrderResponseDto;
import com.hekr.store.exceptions.NotEnoughItems;
import com.hekr.store.exceptions.NotFoundException;
import com.hekr.store.mapper.order.CartCheckoutMapper;
import com.hekr.store.mapper.order.OrderResponseMapper;
import com.hekr.store.model.cart.Cart;
import com.hekr.store.model.order.Order;
import com.hekr.store.model.order.OrderItem;
import com.hekr.store.model.order.OrderStatusHistory;
import com.hekr.store.model.stock.Stock;
import com.hekr.store.model.user.User;
import com.hekr.store.model.warehouse.Warehouse;
import com.hekr.store.repository.OrderRepository;
import com.hekr.store.utils.Status;
import com.hekr.store.utils.Utils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderResponseMapper orderResponseMapper;
    private final CartCheckoutMapper cartCheckoutMapper;
    private final WarehouseService warehouseService;
    private final UserService userService;
    private final CartService cartService;
    private final StockService stockService;

    public List<OrderResponseDto> getOrders(UserDetails userDetails) {
        User user = userService.findByLogin(userDetails.getUsername());
        return orderResponseMapper.toDtoList(orderRepository.findByUserId(user.getId()));
    }

    public OrderResponseDto getOrder(Long id) {
        Order order = orderRepository.findByIdWithItemsAndHistory(id)
                .orElseThrow(() -> new NotFoundException("Заказ не найден"));
        return orderResponseMapper.toDto(order);
    }

    @Transactional
    public OrderResponseDto createCartOrder(UserDetails userDetails, CartCheckoutRequestDto dto) {
        Warehouse warehouse = warehouseService.findById(dto.getWarehouseId());
        User user = userService.findByLogin(userDetails.getUsername());
        List<Cart> cart = cartService.findByUserId(user.getId());
        Map<String, String> errors = new HashMap<>();
        boolean canCheckout = true;
        for (Cart c : cart) {
            Stock stock = stockService.getByVariantIdAndWarehouseId(c.getProductVariant().getId(),
                    dto.getWarehouseId());
            if (stock.getQuantity() <= c.getQuantity()) {
                canCheckout = false;
                errors.put(
                        c.getProductVariant().getId().toString(),
                        String.format("%s (%s %s)", c.getProductVariant().getProduct().getTitle(),
                                c.getProductVariant().getColor(), c.getProductVariant().getSize()) + ": Недостаточно товара. Доступно: " + stock.getQuantity());
            }
        }
        if (!canCheckout) 
            throw new NotEnoughItems("NotEnoughItems", errors);
        Order order = cartCheckoutMapper.toOrder(dto);
        BigDecimal orderTotal = BigDecimal.ZERO;
        for (Cart c : cart) {
            OrderItem item = new OrderItem();
            item.setProductVariant(c.getProductVariant());
            item.setQuantity(c.getQuantity());
            BigDecimal price = Utils.calculatePrice(c);
            item.setPriceAtPurchase(price);
            BigDecimal totalPrice = BigDecimal.valueOf(c.getQuantity()).multiply(price);
            item.setTotalPrice(totalPrice);
            orderTotal = orderTotal.add(totalPrice);
            order.addItem(item);
        }
        order.setStatus(Status.NEW);
        order.setUser(user);
        order.setPrice(orderTotal);
        order.setWarehouse(warehouse);
        order.setDate(LocalDateTime.now());

        OrderStatusHistory orderStatusHistory = OrderStatusHistory.builder()
                .changedBy(userService.getSystem())
                .newStatus(Status.NEW)
                .changedAt(LocalDateTime.now())
                .order(order)
                .comment("Заказ создан")
                .build();
        order.setHistory(Set.of(orderStatusHistory));
        Order saved = orderRepository.save(order);

        cartService.deleteAll(userDetails);
        return orderResponseMapper.toDto(saved);
    }

}