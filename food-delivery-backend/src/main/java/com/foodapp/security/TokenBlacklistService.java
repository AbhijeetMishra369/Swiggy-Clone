package com.foodapp.security;

import io.jsonwebtoken.Claims;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenBlacklistService {
    private final Map<String, Long> jtiToExpiryEpochMs = new ConcurrentHashMap<>();

    public void blacklist(Claims claims) {
        String jti = claims.getId();
        if (jti != null) {
            jtiToExpiryEpochMs.put(jti, claims.getExpiration().getTime());
        }
    }

    public boolean isBlacklisted(String jti) {
        if (jti == null) return false;
        Long exp = jtiToExpiryEpochMs.get(jti);
        if (exp == null) return false;
        if (exp < System.currentTimeMillis()) {
            jtiToExpiryEpochMs.remove(jti);
            return false;
        }
        return true;
    }
}