package com.shekhar.SpringBoot_ecom.model.DTO;

import java.math.BigDecimal;

public record OrderItemResponse(
        String productName,
        int quantity,
        BigDecimal totalPrice
) { }
