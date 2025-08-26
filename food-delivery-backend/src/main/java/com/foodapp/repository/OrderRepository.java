package com.foodapp.repository;

import com.foodapp.domain.Order;
import com.foodapp.domain.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByCreatedAtDesc(AppUser user);
}