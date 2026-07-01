package com.shekhar.SpringBoot_ecom.model.DTO;

public record AuthResponse(
        String token,
        String username,
        String role
) {}
