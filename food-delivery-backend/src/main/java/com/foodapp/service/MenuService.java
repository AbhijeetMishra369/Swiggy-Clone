package com.foodapp.service;

import com.foodapp.domain.MenuItem;
import com.foodapp.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuItemRepository menuItemRepository;

    public List<MenuItem> listMenuForRestaurant(Long restaurantId) {
        return menuItemRepository.findByRestaurantId(restaurantId);
    }

    public List<MenuItem> listMenuForRestaurantByCategory(Long restaurantId, String category) {
        return menuItemRepository.findByRestaurantIdAndCategoryIgnoreCase(restaurantId, category);
    }
}