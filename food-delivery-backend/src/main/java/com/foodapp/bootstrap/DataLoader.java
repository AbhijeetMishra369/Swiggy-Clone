package com.foodapp.bootstrap;

import com.foodapp.domain.*;
import com.foodapp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Profile("!prod")
public class DataLoader implements CommandLineRunner {

    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;
    private final AppUserRepository appUserRepository;
    private final CouponRepository couponRepository;
    private final ReviewRepository reviewRepository;

    @Override
    public void run(String... args) {
        // seed admin
        if (appUserRepository.findByEmail("admin@food.com").isEmpty()) {
            AppUser admin = AppUser.builder()
                    .email("admin@food.com")
                    .name("Admin User")
                    .password(new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode("Admin123!"))
                    .role(Role.ADMIN)
                    .phone("+1-555-0000")
                    .address("HQ")
                    .blocked(false)
                    .build();
            appUserRepository.save(admin);
        }

        if (restaurantRepository.count() > 0) {
            return;
        }

        Restaurant r1 = Restaurant.builder()
                .name("Spice Haven")
                .cuisine("Indian")
                .phone("+1-555-1001")
                .averageRating(new BigDecimal("4.3"))
                .imageUrl("https://images.unsplash.com/photo-1541542684-4a7852a2b3ac?q=80&w=1200&auto=format&fit=crop")
                .location("MG Road, Bengaluru")
                .address(Address.builder().line1("12 MG Road").city("Bengaluru").state("KA").country("IN").postalCode("560001").build())
                .build();
        restaurantRepository.save(r1);

        MenuItem m11 = MenuItem.builder().restaurant(r1).name("Paneer Tikka").description("Smoky grilled paneer").price(new BigDecimal("6.99")).category("starters").available(true).imageUrl("https://images.unsplash.com/photo-1604908176997-43161efe5f3e?q=80&w=1200&auto=format&fit=crop").build();
        MenuItem m12 = MenuItem.builder().restaurant(r1).name("Butter Chicken").description("Creamy tomato gravy").price(new BigDecimal("9.99")).category("main course").available(true).imageUrl("https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=1200&auto=format&fit=crop").build();
        MenuItem m13 = MenuItem.builder().restaurant(r1).name("Masala Chai").description("Spiced tea").price(new BigDecimal("1.99")).category("beverages").available(true).imageUrl("https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=1200&auto=format&fit=crop").build();
        menuItemRepository.save(m11);
        menuItemRepository.save(m12);
        menuItemRepository.save(m13);

        // Seed some reviews for r1
        reviewRepository.save(Review.builder().restaurant(r1).user(appUserRepository.findByEmail("admin@food.com").orElse(null)).rating(5).comment("Fantastic food!").approved(true).createdAt(java.time.OffsetDateTime.now().minusDays(2)).build());
        reviewRepository.save(Review.builder().restaurant(r1).user(appUserRepository.findByEmail("admin@food.com").orElse(null)).rating(4).comment("Loved the paneer").approved(true).createdAt(java.time.OffsetDateTime.now().minusDays(1)).build());

        Restaurant r2 = Restaurant.builder()
                .name("Pasta Piazza")
                .cuisine("Italian")
                .phone("+1-555-2002")
                .averageRating(new BigDecimal("4.3"))
                .imageUrl("https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=1200&auto=format&fit=crop")
                .location("Church Street, Bengaluru")
                .address(Address.builder().line1("45 Church St").city("Bengaluru").state("KA").country("IN").postalCode("560002").build())
                .build();
        restaurantRepository.save(r2);

        MenuItem m21 = MenuItem.builder().restaurant(r2).name("Bruschetta").description("Tomato basil toast").price(new BigDecimal("5.49")).category("starters").available(true).imageUrl("https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=1200&auto=format&fit=crop").build();
        MenuItem m22 = MenuItem.builder().restaurant(r2).name("Spaghetti Carbonara").description("Classic creamy pasta").price(new BigDecimal("10.99")).category("main course").available(true).imageUrl("https://images.unsplash.com/photo-1523986371872-9d3ba2e2a389?q=80&w=1200&auto=format&fit=crop").build();
        MenuItem m23 = MenuItem.builder().restaurant(r2).name("Tiramisu").description("Coffee dessert").price(new BigDecimal("4.99")).category("desserts").available(true).imageUrl("https://images.unsplash.com/photo-1541782814454-8e160c1b08b0?q=80&w=1200&auto=format&fit=crop").build();
        menuItemRepository.save(m21);
        menuItemRepository.save(m22);
        menuItemRepository.save(m23);

        // Seed 3 more restaurants
        Restaurant r3 = Restaurant.builder()
                .name("Dragon Wok")
                .cuisine("Chinese")
                .phone("+1-555-3003")
                .averageRating(new BigDecimal("4.2"))
                .imageUrl("https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop")
                .location("HSR Layout, Bengaluru")
                .address(Address.builder().line1("9 HSR Layout").city("Bengaluru").state("KA").country("IN").postalCode("560102").build())
                .build();
        restaurantRepository.save(r3);
        menuItemRepository.save(MenuItem.builder().restaurant(r3).name("Spring Rolls").description("Crispy veg rolls").price(new BigDecimal("4.49")).category("starters").available(true).imageUrl("https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1200&auto=format&fit=crop").build());
        menuItemRepository.save(MenuItem.builder().restaurant(r3).name("Kung Pao Chicken").description("Spicy stir fry").price(new BigDecimal("9.49")).category("main course").available(true).imageUrl("https://images.unsplash.com/photo-1553624973-9f6c0e24cf9b?q=80&w=1200&auto=format&fit=crop").build());
        menuItemRepository.save(MenuItem.builder().restaurant(r3).name("Fried Rice").description("Egg fried rice").price(new BigDecimal("5.49")).category("main course").available(true).imageUrl("https://images.unsplash.com/photo-1617692855027-7b4286a1af49?q=80&w=1200&auto=format&fit=crop").build());

        // Seed coupons
        if (couponRepository.findByCodeIgnoreCase("NEW50").isEmpty()) {
            couponRepository.save(Coupon.builder().code("NEW50").percentageOff(new BigDecimal("50")).active(true).validFrom(java.time.OffsetDateTime.now().minusDays(1)).validUntil(java.time.OffsetDateTime.now().plusDays(30)).build());
        }
        if (couponRepository.findByCodeIgnoreCase("SAVE20").isEmpty()) {
            couponRepository.save(Coupon.builder().code("SAVE20").percentageOff(new BigDecimal("20")).active(true).validFrom(java.time.OffsetDateTime.now().minusDays(1)).validUntil(java.time.OffsetDateTime.now().plusDays(60)).build());
        }

        Restaurant r4 = Restaurant.builder()
                .name("Taco Fiesta")
                .cuisine("Mexican")
                .phone("+1-555-4004")
                .averageRating(new BigDecimal("4.1"))
                .imageUrl("https://images.unsplash.com/photo-1617195737492-7e0a2b847222?q=80&w=1200&auto=format&fit=crop")
                .location("Indiranagar, Bengaluru")
                .address(Address.builder().line1("21 Indiranagar").city("Bengaluru").state("KA").country("IN").postalCode("560038").build())
                .build();
        restaurantRepository.save(r4);
        menuItemRepository.save(MenuItem.builder().restaurant(r4).name("Nachos").description("Loaded cheese nachos").price(new BigDecimal("4.99")).category("starters").available(true).imageUrl("https://images.unsplash.com/photo-1604467794349-0b74285de7e6?q=80&w=1200&auto=format&fit=crop").build());
        menuItemRepository.save(MenuItem.builder().restaurant(r4).name("Chicken Tacos").description("Soft shell tacos").price(new BigDecimal("7.99")).category("main course").available(true).imageUrl("https://images.unsplash.com/photo-1551504734-5ee1c4a1479a?q=80&w=1200&auto=format&fit=crop").build());
        menuItemRepository.save(MenuItem.builder().restaurant(r4).name("Churros").description("Cinnamon sugar dessert").price(new BigDecimal("3.99")).category("desserts").available(true).imageUrl("https://images.unsplash.com/photo-1514914108550-1b79b1801bd0?q=80&w=1200&auto=format&fit=crop").build());

        Restaurant r5 = Restaurant.builder()
                .name("Burger Barn")
                .cuisine("American")
                .phone("+1-555-5005")
                .averageRating(new BigDecimal("4.0"))
                .imageUrl("https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=1200&auto=format&fit=crop")
                .location("Koramangala, Bengaluru")
                .address(Address.builder().line1("66 Koramangala").city("Bengaluru").state("KA").country("IN").postalCode("560034").build())
                .build();
        restaurantRepository.save(r5);
        menuItemRepository.save(MenuItem.builder().restaurant(r5).name("Classic Burger").description("Beef patty burger").price(new BigDecimal("8.49")).category("main course").available(true).imageUrl("https://images.unsplash.com/photo-1550547660-1b8a1c61a615?q=80&w=1200&auto=format&fit=crop").build());
        menuItemRepository.save(MenuItem.builder().restaurant(r5).name("Fries").description("Crispy french fries").price(new BigDecimal("2.99")).category("sides").available(true).imageUrl("https://images.unsplash.com/photo-1550547660-3f8d9049e7a0?q=80&w=1200&auto=format&fit=crop").build());
        menuItemRepository.save(MenuItem.builder().restaurant(r5).name("Milkshake").description("Vanilla shake").price(new BigDecimal("3.49")).category("beverages").available(true).imageUrl("https://images.unsplash.com/photo-1511910849309-0dffb82f8f9e?q=80&w=1200&auto=format&fit=crop").build());

        // r6: Sushi Station
        Restaurant r6 = Restaurant.builder()
                .name("Sushi Station")
                .cuisine("Japanese")
                .phone("+1-555-6006")
                .averageRating(new BigDecimal("4.4"))
                .imageUrl("https://images.unsplash.com/photo-1540308990836-5a6d2c69419b?q=80&w=1200&auto=format&fit=crop")
                .location("Whitefield, Bengaluru")
                .address(Address.builder().line1("88 Whitefield").city("Bengaluru").state("KA").country("IN").postalCode("560066").build())
                .build();
        restaurantRepository.save(r6);
        menuItemRepository.save(MenuItem.builder().restaurant(r6).name("California Roll").description("Crab and avocado").price(new BigDecimal("7.99")).category("starters").available(true).imageUrl("https://images.unsplash.com/photo-1617191518000-3f2f2e1f3f87?q=80&w=1200&auto=format&fit=crop").build());
        menuItemRepository.save(MenuItem.builder().restaurant(r6).name("Salmon Nigiri").description("Fresh salmon over rice").price(new BigDecimal("9.49")).category("main course").available(true).imageUrl("https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1200&auto=format&fit=crop").build());
        menuItemRepository.save(MenuItem.builder().restaurant(r6).name("Tempura").description("Crispy prawns").price(new BigDecimal("8.49")).category("starters").available(true).imageUrl("https://images.unsplash.com/photo-1591814468924-caf88d3c9e0e?q=80&w=1200&auto=format&fit=crop").build());
        menuItemRepository.save(MenuItem.builder().restaurant(r6).name("Miso Soup").description("Classic miso broth").price(new BigDecimal("2.49")).category("beverages").available(true).imageUrl("https://images.unsplash.com/photo-1571988840298-86c4d7b9c974?q=80&w=1200&auto=format&fit=crop").build());

        // r7: Curry House
        Restaurant r7 = Restaurant.builder()
                .name("Curry House")
                .cuisine("North Indian")
                .phone("+1-555-7007")
                .averageRating(new BigDecimal("4.2"))
                .imageUrl("https://images.unsplash.com/photo-1604908554027-4662681a0cdc?q=80&w=1200&auto=format&fit=crop")
                .location("Jayanagar, Bengaluru")
                .address(Address.builder().line1("12 Jayanagar").city("Bengaluru").state("KA").country("IN").postalCode("560041").build())
                .build();
        restaurantRepository.save(r7);
        menuItemRepository.save(MenuItem.builder().restaurant(r7).name("Dal Makhani").description("Slow-cooked lentils").price(new BigDecimal("6.49")).category("main course").available(true).imageUrl("https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=1200&auto=format&fit=crop").build());
        menuItemRepository.save(MenuItem.builder().restaurant(r7).name("Garlic Naan").description("Clay oven bread").price(new BigDecimal("1.49")).category("sides").available(true).imageUrl("https://images.unsplash.com/photo-1543332164-6e82f355bad8?q=80&w=1200&auto=format&fit=crop").build());
        menuItemRepository.save(MenuItem.builder().restaurant(r7).name("Gulab Jamun").description("Sweet dessert").price(new BigDecimal("2.49")).category("desserts").available(true).imageUrl("https://images.unsplash.com/photo-1604908554194-556dcf932a3f?q=80&w=1200&auto=format&fit=crop").build());

        // r8: Green Bowl
        Restaurant r8 = Restaurant.builder()
                .name("Green Bowl")
                .cuisine("Healthy")
                .phone("+1-555-8008")
                .averageRating(new BigDecimal("4.5"))
                .imageUrl("https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1200&auto=format&fit=crop")
                .location("BTM Layout, Bengaluru")
                .address(Address.builder().line1("9 BTM Layout").city("Bengaluru").state("KA").country("IN").postalCode("560076").build())
                .build();
        restaurantRepository.save(r8);
        menuItemRepository.save(MenuItem.builder().restaurant(r8).name("Quinoa Salad").description("Fresh greens").price(new BigDecimal("5.99")).category("starters").available(true).imageUrl("https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop").build());
        menuItemRepository.save(MenuItem.builder().restaurant(r8).name("Grilled Chicken Bowl").description("Protein packed").price(new BigDecimal("8.99")).category("main course").available(true).imageUrl("https://images.unsplash.com/photo-1514517220036-e3fd10e3c9a2?q=80&w=1200&auto=format&fit=crop").build());
        menuItemRepository.save(MenuItem.builder().restaurant(r8).name("Smoothie").description("Berry blend").price(new BigDecimal("3.99")).category("beverages").available(true).imageUrl("https://images.unsplash.com/photo-1494390248081-4e521a5940db?q=80&w=1200&auto=format&fit=crop").build());

        // r9: Pizza Palace
        Restaurant r9 = Restaurant.builder()
                .name("Pizza Palace")
                .cuisine("Pizza")
                .phone("+1-555-9009")
                .averageRating(new BigDecimal("4.1"))
                .imageUrl("https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop")
                .location("Marathahalli, Bengaluru")
                .address(Address.builder().line1("32 Marathahalli").city("Bengaluru").state("KA").country("IN").postalCode("560037").build())
                .build();
        restaurantRepository.save(r9);
        menuItemRepository.save(MenuItem.builder().restaurant(r9).name("Margherita").description("Fresh basil & cheese").price(new BigDecimal("6.99")).category("main course").available(true).imageUrl("https://images.unsplash.com/photo-1548365328-9f547fb0953b?q=80&w=1200&auto=format&fit=crop").build());
        menuItemRepository.save(MenuItem.builder().restaurant(r9).name("Pepperoni").description("Classic favorite").price(new BigDecimal("7.99")).category("main course").available(true).imageUrl("https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?q=80&w=1200&auto=format&fit=crop").build());
        menuItemRepository.save(MenuItem.builder().restaurant(r9).name("Garlic Bread").description("Cheesy bites").price(new BigDecimal("3.49")).category("starters").available(true).imageUrl("https://images.unsplash.com/photo-1559181567-c3190ca9959b?q=80&w=1200&auto=format&fit=crop").build());

        // r10: Sweet Tooth
        Restaurant r10 = Restaurant.builder()
                .name("Sweet Tooth")
                .cuisine("Desserts")
                .phone("+1-555-1010")
                .averageRating(new BigDecimal("4.6"))
                .imageUrl("https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1200&auto=format&fit=crop")
                .location("Hebbal, Bengaluru")
                .address(Address.builder().line1("11 Hebbal").city("Bengaluru").state("KA").country("IN").postalCode("560024").build())
                .build();
        restaurantRepository.save(r10);
        menuItemRepository.save(MenuItem.builder().restaurant(r10).name("Chocolate Cake").description("Rich and moist").price(new BigDecimal("4.99")).category("desserts").available(true).imageUrl("https://images.unsplash.com/photo-1541782814454-8e160c1b08b0?q=80&w=1200&auto=format&fit=crop").build());
        menuItemRepository.save(MenuItem.builder().restaurant(r10).name("Ice Cream Sundae").description("Vanilla with toppings").price(new BigDecimal("3.99")).category("desserts").available(true).imageUrl("https://images.unsplash.com/photo-1505253668822-42074d58a7bf?q=80&w=1200&auto=format&fit=crop").build());
        menuItemRepository.save(MenuItem.builder().restaurant(r10).name("Cheesecake").description("New York style").price(new BigDecimal("5.49")).category("desserts").available(true).imageUrl("https://images.unsplash.com/photo-1562440499-64c9a111f713?q=80&w=1200&auto=format&fit=crop").build());
    }
}