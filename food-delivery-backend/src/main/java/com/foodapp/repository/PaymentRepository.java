package com.foodapp.repository;

import com.foodapp.domain.Payment;
import com.foodapp.domain.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByOrder(Order order);
    Optional<Payment> findByProviderOrderId(String providerOrderId);
}