package com.foodapp.api;

import com.foodapp.domain.Coupon;
import com.foodapp.domain.Restaurant;
import com.foodapp.domain.MenuItem;
import com.foodapp.repository.CouponRepository;
import com.foodapp.repository.ReviewRepository;
import com.foodapp.repository.OrderRepository;
import com.foodapp.repository.RestaurantRepository;
import com.foodapp.repository.MenuItemRepository;
import com.foodapp.repository.AppUserRepository;
import com.foodapp.domain.AppUser;
import org.springframework.transaction.annotation.Transactional;
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
    private final MenuItemRepository menuItemRepository;
    private final OrderRepository orderRepository;
    private final CouponRepository couponRepository;
    private final AppUserRepository appUserRepository;
    private final ReviewRepository reviewRepository;

    // /admin/restaurants
    @GetMapping("/restaurants")
    public List<Restaurant> listRestaurants() { return restaurantRepository.findAll(); }
    @PostMapping("/restaurants")
    public Restaurant createRestaurant(@RequestBody Restaurant r) { return restaurantRepository.save(r); }
    @PostMapping("/restaurants/{id}/menu")
    public MenuItem createMenuItem(@PathVariable Long id, @RequestBody MenuItem m) {
        Restaurant r = restaurantRepository.findById(id).orElseThrow();
        m.setRestaurant(r);
        return menuItemRepository.save(m);
    }
    @GetMapping("/restaurants/{id}/menu")
    public List<MenuItem> listMenu(@PathVariable Long id) { return menuItemRepository.findByRestaurantId(id); }
    @PutMapping("/menu/{menuId}")
    public MenuItem updateMenuItem(@PathVariable Long menuId, @RequestBody MenuItem m) {
        MenuItem db = menuItemRepository.findById(menuId).orElseThrow();
        db.setName(m.getName());
        db.setDescription(m.getDescription());
        db.setPrice(m.getPrice());
        db.setCategory(m.getCategory());
        db.setAvailable(m.getAvailable());
        db.setImageUrl(m.getImageUrl());
        return menuItemRepository.save(db);
    }
    @DeleteMapping("/menu/{menuId}")
    public ResponseEntity<?> deleteMenuItem(@PathVariable Long menuId) { menuItemRepository.deleteById(menuId); return ResponseEntity.ok().build(); }
    @DeleteMapping("/restaurants/{id}")
    public ResponseEntity<?> deleteRestaurant(@PathVariable Long id) { restaurantRepository.deleteById(id); return ResponseEntity.ok().build(); }
    @GetMapping("/restaurants/{id}")
    public Restaurant getRestaurant(@PathVariable Long id) { return restaurantRepository.findById(id).orElseThrow(); }
    @PutMapping("/restaurants/{id}")
    public Restaurant updateRestaurant(@PathVariable Long id, @RequestBody Restaurant updated) {
        Restaurant r = restaurantRepository.findById(id).orElseThrow();
        r.setName(updated.getName());
        r.setCuisine(updated.getCuisine());
        r.setPhone(updated.getPhone());
        r.setAverageRating(updated.getAverageRating());
        r.setImageUrl(updated.getImageUrl());
        r.setLocation(updated.getLocation());
        return restaurantRepository.save(r);
    }

    // /admin/orders
    @GetMapping("/orders")
    public Object listOrders() { return orderRepository.findAll(); }
    @PutMapping("/orders/{id}/status")
    @Transactional
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody java.util.Map<String,String> body) {
        String status = body.getOrDefault("status", "Pending");
        var order = orderRepository.findById(id).orElseThrow();
        order.setStatus(status);
        // orderRepository.save(order); // transactional context will flush
        return ResponseEntity.ok().build();
    }

    // /admin/coupons
    @GetMapping("/coupons")
    public List<Coupon> listCoupons() { return couponRepository.findAll(); }
    @PostMapping("/coupons")
    public Coupon createCoupon(@RequestBody Coupon c) { return couponRepository.save(c); }
    @PutMapping("/coupons/{id}")
    public Coupon updateCoupon(@PathVariable Long id, @RequestBody Coupon c) {
        Coupon db = couponRepository.findById(id).orElseThrow();
        db.setCode(c.getCode());
        db.setPercentageOff(c.getPercentageOff());
        db.setAmountOff(c.getAmountOff());
        db.setValidFrom(c.getValidFrom());
        db.setValidUntil(c.getValidUntil());
        db.setActive(c.getActive());
        return couponRepository.save(db);
    }
    @DeleteMapping("/coupons/{id}")
    public ResponseEntity<?> deleteCoupon(@PathVariable Long id) { couponRepository.deleteById(id); return ResponseEntity.ok().build(); }

    // /admin/users
    @GetMapping("/users")
    public List<AppUser> listUsers() { return appUserRepository.findAll(); }
    @PutMapping("/users/{id}/block")
    public ResponseEntity<?> blockUser(@PathVariable Long id, @RequestBody java.util.Map<String,Boolean> body) {
        boolean blocked = java.util.Objects.equals(body.get("blocked"), Boolean.TRUE);
        AppUser u = appUserRepository.findById(id).orElseThrow();
        u.setBlocked(blocked);
        appUserRepository.save(u);
        return ResponseEntity.ok().build();
    }

    // /admin/reviews
    @GetMapping("/reviews")
    public List<com.foodapp.domain.Review> listReviews() { return reviewRepository.findAll(); }
    @PutMapping("/reviews/{id}/approve")
    public ResponseEntity<?> approveReview(@PathVariable Long id, @RequestBody java.util.Map<String,Boolean> body) {
        boolean approved = java.util.Objects.equals(body.get("approved"), Boolean.TRUE);
        var r = reviewRepository.findById(id).orElseThrow();
        r.setApproved(approved);
        reviewRepository.save(r);
        return ResponseEntity.ok().build();
    }
}