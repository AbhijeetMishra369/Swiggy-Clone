package com.foodapp.service;

import com.foodapp.domain.AppUser;
import com.foodapp.domain.Role;
import com.foodapp.repository.AppUserRepository;
import com.foodapp.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AppUserRepository appUserRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AppUser register(String email, String name, String rawPassword, String phone, String address) {
        if (appUserRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already in use");
        }
        AppUser user = AppUser.builder()
                .email(email)
                .name(name)
                .password(passwordEncoder.encode(rawPassword))
                .role(Role.CUSTOMER)
                .phone(phone)
                .address(address)
                .blocked(false)
                .build();
        return appUserRepository.save(user);
    }

    public String loginAndGetToken(String email, String rawPassword) {
        AppUser user = appUserRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        if (Boolean.TRUE.equals(user.getBlocked())) {
            throw new IllegalStateException("User is blocked");
        }
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        return jwtUtil.generateToken(user.getEmail(), Map.of(
                "role", user.getRole().name(),
                "name", user.getName(),
                "uid", user.getId()
        ));
    }
}