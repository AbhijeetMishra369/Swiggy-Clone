package com.foodapp.repository;

import com.foodapp.domain.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

    List<Restaurant> findByCuisineIgnoreCase(String cuisine);

    @Query("select r from Restaurant r where lower(r.address.city) = lower(?1)")
    List<Restaurant> findByCity(String city);

    @Query("select r from Restaurant r order by r.averageRating desc")
    List<Restaurant> findTopRated();

    @Query("select r from Restaurant r where lower(r.name) like lower(concat('%', ?1, '%'))")
    List<Restaurant> searchByName(String q);
}

