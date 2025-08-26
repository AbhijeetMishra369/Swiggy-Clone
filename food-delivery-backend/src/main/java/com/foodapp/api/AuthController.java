package com.foodapp.api;

import com.foodapp.domain.AppUser;
import com.foodapp.domain.Role;
import com.foodapp.dto.LoginRequest;
import com.foodapp.dto.RegisterRequest;
import com.foodapp.service.AuthService;
import com.foodapp.repository.AppUserRepository;
import com.foodapp.security.JwtUtil;
import com.foodapp.security.TokenBlacklistService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Validated
public class AuthController {

    private final AuthService authService;
    private final AppUserRepository appUserRepository;
    private final JwtUtil jwtUtil;
    private final TokenBlacklistService blacklistService;

    @Value("${security.superAdminEmail:admin@food.com}")
    private String superAdminEmail;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        AppUser user = authService.register(request.getEmail(), request.getName(), request.getPassword(), request.getPhone(), request.getAddress());
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "name", user.getName(),
                "role", user.getRole().name()
        ));
    }

    @PostMapping("/admin/register")
    public ResponseEntity<?> registerAdmin(@RequestHeader("X-Admin-Email") String requesterEmail, @RequestBody RegisterRequest request) {
        if (!superAdminEmail.equalsIgnoreCase(requesterEmail)) {
            return ResponseEntity.status(403).body(Map.of("message", "Not authorized"));
        }
        AppUser user = authService.register(request.getEmail(), request.getName(), request.getPassword(), request.getPhone(), request.getAddress());
        user.setRole(Role.ADMIN);
        appUserRepository.save(user);
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "name", user.getName(),
                "role", user.getRole().name()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String token = authService.loginAndGetToken(request.getEmail(), request.getPassword());
        AppUser user = appUserRepository.findByEmail(request.getEmail()).orElseThrow();
        return ResponseEntity.ok(Map.of(
                "token", token,
                "id", user.getId(),
                "email", user.getEmail(),
                "name", user.getName(),
                "role", user.getRole().name()
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                Claims claims = jwtUtil.parseClaims(token);
                blacklistService.blacklist(claims);
            } catch (Exception ignored) {}
        }
        return ResponseEntity.ok(Map.of("message", "logged out"));
    }
}