package com.shekhar.SpringBoot_ecom.model.DTO;

import com.shekhar.SpringBoot_ecom.model.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record StatusUpdateRequest(
        @NotNull(message = "Status is required")
        OrderStatus status
) {}
