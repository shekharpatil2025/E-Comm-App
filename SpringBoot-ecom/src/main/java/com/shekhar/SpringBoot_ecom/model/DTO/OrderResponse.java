package com.shekhar.SpringBoot_ecom.model.DTO;

import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        String orderId,
        String customerName,
        String email,
        String status,
        LocalDateTime orderDate,
        List<OrderItemResponse> items
) { }
