package com.sait.budgetingapp_backend.security;

import com.sait.budgetingapp_backend.config.JwtConfig;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {
    private final SecretKey secretKey;

    public JwtUtil(JwtConfig jwtConfig) {
        byte[] keyBytes = Decoders.BASE64.decode(jwtConfig.getSecret());
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);  // Ensure it's a SecretKey
    }

    public String extractUsername(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)  // Proper key usage
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
                .parseSignedClaims(token); // Will throw exception if invalid
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
