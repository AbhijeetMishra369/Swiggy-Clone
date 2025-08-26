package com.foodapp.api;

import com.foodapp.domain.AppUser;
import com.foodapp.domain.Cart;
import com.foodapp.domain.Order;
import com.foodapp.dto.PlaceOrderRequest;
import com.foodapp.repository.AppUserRepository;
import com.foodapp.repository.CartRepository;
import com.foodapp.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final AppUserRepository appUserRepository;
    private final CartRepository cartRepository;

    private AppUser currentUser(Authentication auth) {
        return appUserRepository.findByEmail(auth.getName()).orElseThrow();
    }

    @PostMapping("/place")
    public ResponseEntity<Order> place(@Valid @RequestBody PlaceOrderRequest req, Authentication auth) {
        AppUser user = currentUser(auth);
        Cart cart = cartRepository.findByUser(user).orElseThrow();
        Order order = orderService.placeOrder(user, cart, req.getRestaurantId(), req.getCouponCode());
        return ResponseEntity.ok(order);
    }

    @GetMapping("/{id}/track")
    public ResponseEntity<Order> track(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.track(id));
    }
}