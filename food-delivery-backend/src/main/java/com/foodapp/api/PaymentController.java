package com.foodapp.api;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final RazorpayClient client;
    private final String keySecret;

    public PaymentController(
            @Value("${razorpay.keyId}") String keyId,
            @Value("${razorpay.keySecret}") String keySecret
    ) throws Exception {
        this.client = new RazorpayClient(keyId, keySecret);
        this.keySecret = keySecret;
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody Map<String, Object> payload) throws Exception {
        // expected: { orderId: number, amount: paise }
        int amount = ((Number) payload.getOrDefault("amount", 0)).intValue();
        String receipt = "foodapp_" + payload.getOrDefault("orderId", System.currentTimeMillis());
        JSONObject orderReq = new JSONObject();
        orderReq.put("amount", amount);
        orderReq.put("currency", "INR");
        orderReq.put("receipt", receipt);
        Order order = client.Orders.create(orderReq);
        return ResponseEntity.ok(Map.of(
                "providerOrderId", order.get("id"),
                "amount", order.get("amount"),
                "currency", order.get("currency")
        ));
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody Map<String, Object> payload) throws Exception {
        // payload: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
        String orderId = (String) payload.get("razorpay_order_id");
        String paymentId = (String) payload.get("razorpay_payment_id");
        String signature = (String) payload.get("razorpay_signature");
        String body = orderId + '|' + paymentId;
        String expected = hmacSha256(body, keySecret);
        boolean verified = expected.equals(signature);
        return ResponseEntity.ok(Map.of("verified", verified));
    }

    private static String hmacSha256(String data, String secret) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        mac.init(secretKeySpec);
        byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(rawHmac);
    }
}