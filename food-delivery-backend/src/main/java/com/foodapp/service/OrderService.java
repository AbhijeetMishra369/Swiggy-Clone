package com.foodapp.service;

import com.foodapp.domain.*;
import com.foodapp.repository.CouponRepository;
import com.foodapp.repository.OrderRepository;
import com.foodapp.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final RestaurantRepository restaurantRepository;
    private final CouponRepository couponRepository;

    @Transactional
    public Order placeOrder(AppUser user, Cart cart, Long restaurantId, String couponCode) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new IllegalArgumentException("Restaurant not found"));
        Order order = new Order();
        order.setUser(user);
        order.setRestaurant(restaurant);
        order.setStatus("Pending");
        order.setCreatedAt(OffsetDateTime.now());

        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem ci : cart.getItems()) {
            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setMenuItem(ci.getMenuItem());
            oi.setQuantity(ci.getQuantity());
            oi.setPrice(ci.getMenuItem().getPrice());
            order.getItems().add(oi);
            subtotal = subtotal.add(ci.getMenuItem().getPrice().multiply(BigDecimal.valueOf(ci.getQuantity())));
        }
        order.setSubtotal(subtotal);
        BigDecimal discount = BigDecimal.ZERO;
        if (couponCode != null && !couponCode.isBlank()) {
            couponRepository.findByCodeIgnoreCase(couponCode).ifPresent(c -> {
                // simplistic discount logic
            });
        }
        order.setDiscount(discount);
        order.setTotal(subtotal.subtract(discount));
        return orderRepository.save(order);
    }

    public Order track(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
    }
}