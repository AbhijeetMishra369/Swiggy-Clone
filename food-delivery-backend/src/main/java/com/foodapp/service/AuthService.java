package com.foodapp.service;

import com.foodapp.domain.AppUser;
import com.foodapp.repository.AppUserRepository;
import com.foodapp.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AppUserRepository appUserRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AppUser signup(String email, String fullName, String rawPassword) {
        if (appUserRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already in use");
        }
        AppUser user = AppUser.builder()
                .email(email)
                .fullName(fullName)
                .passwordHash(passwordEncoder.encode(rawPassword))
                .roles(Set.of("CUSTOMER"))
                .blocked(false)
                .build();
        return appUserRepository.save(user);
    }

    public String login(String email, String rawPassword) {
        AppUser user = appUserRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        if (Boolean.TRUE.equals(user.getBlocked())) {
            throw new IllegalStateException("User is blocked");
        }
        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        return jwtUtil.generateToken(user.getEmail(), Map.of(
                "roles", user.getRoles(),
                "name", user.getFullName(),
                "uid", user.getId()
        ));
    }
}