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
                .averageRating(new BigDecimal("4.5"))
                .address(Address.builder().line1("12 MG Road").city("Bengaluru").state("KA").country("IN").postalCode("560001").build())
                .build();
        restaurantRepository.save(r1);

        MenuItem m11 = MenuItem.builder().restaurant(r1).name("Paneer Tikka").description("Smoky grilled paneer").price(new BigDecimal("6.99")).category("starters").available(true).build();
        MenuItem m12 = MenuItem.builder().restaurant(r1).name("Butter Chicken").description("Creamy tomato gravy").price(new BigDecimal("9.99")).category("main course").available(true).build();
        MenuItem m13 = MenuItem.builder().restaurant(r1).name("Masala Chai").description("Spiced tea").price(new BigDecimal("1.99")).category("beverages").available(true).build();
        menuItemRepository.save(m11);
        menuItemRepository.save(m12);
        menuItemRepository.save(m13);

        Restaurant r2 = Restaurant.builder()
                .name("Pasta Piazza")
                .cuisine("Italian")
                .phone("+1-555-2002")
                .averageRating(new BigDecimal("4.3"))
                .address(Address.builder().line1("45 Church St").city("Bengaluru").state("KA").country("IN").postalCode("560002").build())
                .build();
        restaurantRepository.save(r2);

        MenuItem m21 = MenuItem.builder().restaurant(r2).name("Bruschetta").description("Tomato basil toast").price(new BigDecimal("5.49")).category("starters").available(true).build();
        MenuItem m22 = MenuItem.builder().restaurant(r2).name("Spaghetti Carbonara").description("Classic creamy pasta").price(new BigDecimal("10.99")).category("main course").available(true).build();
        MenuItem m23 = MenuItem.builder().restaurant(r2).name("Tiramisu").description("Coffee dessert").price(new BigDecimal("4.99")).category("desserts").available(true).build();
        menuItemRepository.save(m21);
        menuItemRepository.save(m22);
        menuItemRepository.save(m23);
    }
}