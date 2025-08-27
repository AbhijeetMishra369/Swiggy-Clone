package com.foodapp.api;

import com.foodapp.domain.Restaurant;
import com.foodapp.domain.AppUser;
import com.foodapp.domain.Review;
import com.foodapp.service.RestaurantService;
import com.foodapp.repository.RestaurantRepository;
import com.foodapp.repository.ReviewRepository;
import com.foodapp.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;
    private final RestaurantRepository restaurantRepository;
    private final ReviewRepository reviewRepository;
    private final AppUserRepository appUserRepository;

    @GetMapping
    public Page<Restaurant> list(
            @RequestParam(required = false) String cuisine,
            @RequestParam(required = false, defaultValue = "false") boolean top,
            @RequestParam(required = false, name = "q") String query,
            Pageable pageable
    ) {
        if (top) {
            return restaurantService.listTopRated(pageable);
        }
        return restaurantService.search(query, cuisine, pageable);
    }

    @GetMapping("/{id}/reviews")
    public List<Review> listReviews(@PathVariable Long id) {
        Restaurant r = restaurantRepository.findById(id).orElseThrow();
        return reviewRepository.findByRestaurantOrderByCreatedAtDesc(r);
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<Review> createReview(@PathVariable Long id, @RequestBody Review review, Authentication auth) {
        AppUser user = appUserRepository.findByEmail(auth.getName()).orElseThrow();
        Restaurant r = restaurantRepository.findById(id).orElseThrow();
        review.setId(null);
        review.setRestaurant(r);
        review.setUser(user);
        review.setApproved(true);
        review.setCreatedAt(java.time.OffsetDateTime.now());
        return ResponseEntity.ok(reviewRepository.save(review));
    }
}