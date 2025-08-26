package com.foodapp.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody Map<String, Object> payload) {
        // expected: { orderId: number, amount: paise }
        // TODO: integrate Razorpay SDK to create order in test mode using 'amount'
        return ResponseEntity.ok(Map.of(
                "providerOrderId", "razorpay_test_order_123",
                "orderId", payload.get("orderId"),
                "amount", payload.get("amount")
        ));
    }

    @PostMapping("/status")
    public ResponseEntity<?> status(@RequestBody Map<String, Object> payload) {
        // TODO: verify signature and payment status
        return ResponseEntity.ok(Map.of("status", "success"));
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody Map<String, Object> payload) {
        // TODO: verify Razorpay signature (stub). Expect: razorpay_order_id, razorpay_payment_id, razorpay_signature
        return ResponseEntity.ok(Map.of("verified", true));
    }
}