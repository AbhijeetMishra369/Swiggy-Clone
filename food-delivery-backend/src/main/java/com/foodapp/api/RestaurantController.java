package com.foodapp.api;

import com.foodapp.domain.Restaurant;
import com.foodapp.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;

    @GetMapping
    public List<Restaurant> list(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String cuisine,
            @RequestParam(required = false, defaultValue = "false") boolean top
    ) {
        if (top) {
            return restaurantService.listTopRated();
        }
        if (city != null && !city.isBlank()) {
            return restaurantService.listByCity(city);
        }
        if (cuisine != null && !cuisine.isBlank()) {
            return restaurantService.listByCuisine(cuisine);
        }
        return restaurantService.listAll();
    }
}