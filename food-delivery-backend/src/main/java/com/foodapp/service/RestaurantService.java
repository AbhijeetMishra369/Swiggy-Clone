package com.foodapp.service;

import com.foodapp.domain.Restaurant;
import com.foodapp.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    public Page<Restaurant> search(String query, String cuisine, Pageable pageable) {
        return restaurantRepository.search(query, cuisine, pageable);
    }

    public Page<Restaurant> listTopRated(Pageable pageable) {
        return restaurantRepository.findTopRated(pageable);
    }
}