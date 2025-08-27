package com.foodapp.repository;

import com.foodapp.domain.Restaurant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface RestaurantRepository extends PagingAndSortingRepository<Restaurant, Long> {

    @Query("SELECT r FROM Restaurant r WHERE " +
            "(:query IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
            "(:cuisine IS NULL OR LOWER(r.cuisine) = LOWER(:cuisine))")
    Page<Restaurant> search(@Param("query") String query, @Param("cuisine") String cuisine, Pageable pageable);

    @Query("select r from Restaurant r order by r.averageRating desc")
    Page<Restaurant> findTopRated(Pageable pageable);
}
