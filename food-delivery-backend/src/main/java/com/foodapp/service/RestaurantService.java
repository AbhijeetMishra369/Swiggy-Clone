package com.foodapp.service;

import com.foodapp.domain.Restaurant;
import com.foodapp.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    public List<Restaurant> listAll() {
        return restaurantRepository.findAll();
    }

    public List<Restaurant> listByCity(String city) {
        return restaurantRepository.findByCity(city);
    }

    public List<Restaurant> listByCuisine(String cuisine) {
        return restaurantRepository.findByCuisineIgnoreCase(cuisine);
    }

    public List<Restaurant> listTopRated() {
        return restaurantRepository.findTopRated();
    }
}