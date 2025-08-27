package com.foodapp.api;

import com.foodapp.domain.Order;
import com.foodapp.domain.Payment;
import com.foodapp.repository.OrderRepository;
import com.foodapp.repository.PaymentRepository;
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
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    public PaymentController(
            @Value("${razorpay.keyId}") String keyId,
            @Value("${razorpay.keySecret}") String keySecret,
            OrderRepository orderRepository,
            PaymentRepository paymentRepository
    ) throws Exception {
        this.client = new RazorpayClient(keyId, keySecret);
        this.keySecret = keySecret;
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody Map<String, Object> payload) throws Exception {
        // expected: { orderId: number, amount: paise }
        Long orderId = ((Number) payload.get("orderId")).longValue();
        int amount = ((Number) payload.getOrDefault("amount", 0)).intValue();
        com.razorpay.Order rpOrder;
        String receipt = "foodapp_" + orderId;
        JSONObject orderReq = new JSONObject();
        orderReq.put("amount", amount);
        orderReq.put("currency", "INR");
        orderReq.put("receipt", receipt);
        rpOrder = client.Orders.create(orderReq);

        Order appOrder = orderRepository.findById(orderId).orElseThrow();
        appOrder.setPaymentStatus("PENDING");
        Payment payment = paymentRepository.findByOrder(appOrder).orElse(Payment.builder().order(appOrder).build());
        payment.setAmount(appOrder.getTotal());
        payment.setProvider("razorpay");
        payment.setProviderOrderId(rpOrder.get("id"));
        payment.setStatus("created");
        paymentRepository.save(payment);
        orderRepository.save(appOrder);

        return ResponseEntity.ok(Map.of(
                "providerOrderId", rpOrder.get("id"),
                "amount", rpOrder.get("amount"),
                "currency", rpOrder.get("currency")
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
        paymentRepository.findByProviderOrderId(orderId).ifPresent(p -> {
            p.setProviderPaymentId(paymentId);
            p.setProviderSignature(signature);
            p.setStatus(verified ? "success" : "failed");
            paymentRepository.save(p);
            Order o = p.getOrder();
            o.setPaymentStatus(verified ? "PAID" : "FAILED");
            if (verified) {
                o.setStatus("Preparing");
            }
            orderRepository.save(o);
        });
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