package com.foodapp.dto;

import lombok.Data;

@Data
public class PlaceOrderRequest {
    private Long restaurantId;
    private String couponCode; // optional
    private String paymentMethod; // COD or RAZORPAY
}

