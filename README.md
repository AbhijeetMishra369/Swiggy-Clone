# Swiggy-Clone
Food Order Application
Food Delivery App (React + Spring Boot + MySQL)

Run backend:

1) Ensure MySQL is running with DB `foodapp` and credentials from `application.yml`.
2) Export Razorpay test keys:

```
export RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
export RAZORPAY_KEY_SECRET=test_secret
```

3) Start backend:

```
cd food-delivery-backend
mvn spring-boot:run
```

Run frontend:

```
cd frontend
cp .env.example .env || true
echo "VITE_API_BASE_URL=http://localhost:8080" >> .env
echo "VITE_RAZORPAY_KEY_ID=$RAZORPAY_KEY_ID" >> .env
npm install
npm run dev
```