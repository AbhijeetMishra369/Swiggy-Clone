package com.foodapp.api;

import com.foodapp.domain.Coupon;
import com.foodapp.domain.Restaurant;
import com.foodapp.repository.CouponRepository;
import com.foodapp.repository.OrderRepository;
import com.foodapp.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final RestaurantRepository restaurantRepository;
    private final OrderRepository orderRepository;
    private final CouponRepository couponRepository;

    // /admin/restaurants
    @GetMapping("/restaurants")
    public List<Restaurant> listRestaurants() { return restaurantRepository.findAll(); }
    @PostMapping("/restaurants")
    public Restaurant createRestaurant(@RequestBody Restaurant r) { return restaurantRepository.save(r); }
    @DeleteMapping("/restaurants/{id}")
    public ResponseEntity<?> deleteRestaurant(@PathVariable Long id) { restaurantRepository.deleteById(id); return ResponseEntity.ok().build(); }

    // /admin/orders
    @GetMapping("/orders")
    public Object listOrders() { return orderRepository.findAll(); }

    // /admin/coupons
    @GetMapping("/coupons")
    public List<Coupon> listCoupons() { return couponRepository.findAll(); }
    @PostMapping("/coupons")
    public Coupon createCoupon(@RequestBody Coupon c) { return couponRepository.save(c); }
}