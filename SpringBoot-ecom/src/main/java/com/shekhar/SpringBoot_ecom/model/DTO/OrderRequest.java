package com.shekhar.SpringBoot_ecom.model.DTO;

import java.util.List;

public record OrderRequest(
        String customerName,
        String email,
        List<OrderItemRequest> items
) {
}
