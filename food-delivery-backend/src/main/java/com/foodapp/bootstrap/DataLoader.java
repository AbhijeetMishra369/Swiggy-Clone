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
    }
}