package com.hekr.store.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hekr.store.dto.order.CartCheckoutRequestDto;
import com.hekr.store.dto.order.OrderResponseDto;
import com.hekr.store.dto.order.SingleCheckoutRequestDto;
import com.hekr.store.exceptions.NotEnoughItems;
import com.hekr.store.exceptions.NotFoundException;
import com.hekr.store.interfaces.OrderDtoInterface;
import com.hekr.store.mapper.order.CartCheckoutMapper;
import com.hekr.store.mapper.order.OrderResponseMapper;
import com.hekr.store.mapper.order.SimpleOrderResponseMapper;
import com.hekr.store.mapper.order.SingleCheckoutRequestMapper;
import com.hekr.store.model.cart.Cart;
import com.hekr.store.model.order.Order;
import com.hekr.store.model.order.OrderItem;
import com.hekr.store.model.order.OrderStatusHistory;
import com.hekr.store.model.product.ProductVariant;
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
    private final ProductService productService;
    private final SingleCheckoutRequestMapper singleCheckoutRequestMapper;
    private final SimpleOrderResponseMapper simpleOrderResponseMapper;

    public List<? extends OrderDtoInterface> getOrders(UserDetails userDetails, boolean verbose) {
        User user = userService.findByLogin(userDetails.getUsername());

        if (verbose)
            return orderResponseMapper.toDtoList(orderRepository.findByUserIdVerbose(user.getId()));
        else return simpleOrderResponseMapper.toDtoList(orderRepository.findByUserIdSimple(user.getId()));
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
            if (stock.getQuantity() < c.getQuantity()) {
                canCheckout = false;
                errors.put(
                        c.getProductVariant().getId().toString(),
                        String.format("%s (%s %s)", c.getProductVariant().getProduct().getTitle(),
                                c.getProductVariant().getColor(), c.getProductVariant().getSize())
                                + ": Недостаточно товара. Доступно: " + stock.getQuantity());

            } else {
                stock.setQuantity(stock.getQuantity() - c.getQuantity());
                stockService.saveStock(stock);
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
        order.addHistory(orderStatusHistory);
        Order saved = orderRepository.save(order);

        cartService.deleteAll(userDetails);
        return orderResponseMapper.toDto(saved);
    }

    @Transactional
    public OrderResponseDto createSingleOrder(UserDetails userDetails, SingleCheckoutRequestDto dto) {
        Warehouse warehouse = warehouseService.findById(dto.getWarehouseId());
        User user = userService.findByLogin(userDetails.getUsername());
        ProductVariant variant = productService.getProductVariantById(dto.getVariantId());
        Stock stock = stockService.getByVariantIdAndWarehouseId(dto.getVariantId(), dto.getWarehouseId());
        if (stock.getQuantity() < dto.getQuantity()) {
            Map<String, String> errors = Map.of(dto.getVariantId().toString(),
                    String.format("%s (%s %s)", variant.getProduct().getTitle(),
                            variant.getColor(), variant.getSize()) + ": Недостаточно товара. Доступно: "
                            + stock.getQuantity());
            throw new NotEnoughItems("NotEnoughItems", errors);
        }
        stock.setQuantity(stock.getQuantity() - dto.getQuantity());
        stockService.saveStock(stock);
        Order order = singleCheckoutRequestMapper.toOrder(dto);
        OrderItem item = new OrderItem();
        Cart c = Cart.builder().productVariant(variant).quantity(dto.getQuantity()).user(user).build();
        BigDecimal price = Utils.calculatePrice(c);
        item.setPriceAtPurchase(price);
        item.setQuantity(dto.getQuantity());
        BigDecimal totalPrice = BigDecimal.valueOf(dto.getQuantity()).multiply(price);
        item.setTotalPrice(totalPrice);
        item.setProductVariant(variant);

        order.addItem(item);
        order.setStatus(Status.NEW);
        order.setUser(user);
        order.setPrice(totalPrice);
        order.setWarehouse(warehouse);
        order.setDate(LocalDateTime.now());

        OrderStatusHistory orderStatusHistory = OrderStatusHistory.builder()
                .changedBy(userService.getSystem())
                .newStatus(Status.NEW)
                .changedAt(LocalDateTime.now())
                .order(order)
                .comment("Заказ создан")
                .build();
        order.addHistory(orderStatusHistory);
        Order saved = orderRepository.saveAndFlush(order);
        System.out.println("Items count before return: " + saved.getItems().size());
        return orderResponseMapper.toDto(saved);
    }

}