# Food Delivery Backend (Spring Boot)

Run locally:

1. Create `src/main/resources/application.yml` (already present) and set env vars or edit these:

```
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/foodapp?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
    username: root
    password: root

razorpay:
  keyId: ${RAZORPAY_KEY_ID:rzp_test_xxxxxxxxxx}
  keySecret: ${RAZORPAY_KEY_SECRET:test_secret}
```

2. Start MySQL (docker example):

```
docker run --name mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=foodapp -p 3306:3306 -d mysql:8
```

3. Run backend:

```
mvn spring-boot:run
```

Key endpoints:
- POST `/api/payment/create` -> creates Razorpay order
- POST `/api/payment/verify` -> verifies signature, updates payment & order
- POST `/api/orders/place` -> creates order from cart (supports coupon)
