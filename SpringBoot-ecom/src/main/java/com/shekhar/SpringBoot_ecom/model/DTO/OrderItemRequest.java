package com.shekhar.SpringBoot_ecom.model.DTO;

public record OrderItemRequest(
        int productId,
        int quantity
) { }
