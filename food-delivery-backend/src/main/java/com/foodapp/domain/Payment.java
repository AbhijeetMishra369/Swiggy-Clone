package com.foodapp.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "order_id", unique = true)
    private Order order;

    private BigDecimal amount;
    private String provider; // razorpay
    private String providerOrderId;
    private String providerPaymentId;
    private String providerSignature;
    private String status; // created, success, failed
    private OffsetDateTime createdAt;
}