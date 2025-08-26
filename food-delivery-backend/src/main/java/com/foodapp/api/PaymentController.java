package com.foodapp.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody Map<String, Object> payload) {
        // TODO: integrate Razorpay SDK to create order in test mode
        return ResponseEntity.ok(Map.of("providerOrderId", "razorpay_test_order_123"));
    }

    @PostMapping("/status")
    public ResponseEntity<?> status(@RequestBody Map<String, Object> payload) {
        // TODO: verify signature and payment status
        return ResponseEntity.ok(Map.of("status", "success"));
    }
}