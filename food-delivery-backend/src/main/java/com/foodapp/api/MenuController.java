package com.foodapp.api;

import com.foodapp.domain.MenuItem;
import com.foodapp.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants/{restaurantId}/menu")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    @GetMapping
    public List<MenuItem> list(
            @PathVariable Long restaurantId,
            @RequestParam(required = false) String category
    ) {
        if (category != null && !category.isBlank()) {
            return menuService.listMenuForRestaurantByCategory(restaurantId, category);
        }
        return menuService.listMenuForRestaurant(restaurantId);
    }
}