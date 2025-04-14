package com.sait.budgetingapp_backend.security;

import com.sait.budgetingapp_backend.config.JwtConfig;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {
    private final SecretKey secretKey;
    private final long expirationMillis;

    public JwtUtil(JwtConfig jwtConfig) {
        byte[] keyBytes = Decoders.BASE64.decode(jwtConfig.getSecret());
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
        this.expirationMillis = jwtConfig.getExpiration() * 1000L;
    }

    public String generateToken(String email) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMillis))
                .signWith(secretKey)
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
