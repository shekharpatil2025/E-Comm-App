package com.shekhar.SpringBoot_ecom.model;

import java.util.Set;

public enum OrderStatus {
    PLACED,
    CONFIRMED,
    SHIPPED,
    DELIVERED,
    CANCELLED;

    // Define which transitions are allowed from each status
    public Set<OrderStatus> allowedNextStatuses() {
        return switch (this) {
            case PLACED    -> Set.of(CONFIRMED, CANCELLED);
            case CONFIRMED -> Set.of(SHIPPED, CANCELLED);
            case SHIPPED   -> Set.of(DELIVERED);
            case DELIVERED -> Set.of(); // terminal state — no further transitions
            case CANCELLED -> Set.of(); // terminal state — no further transitions
        };
    }

    // Check if transition to next status is valid
    public boolean canTransitionTo(OrderStatus next) {
        return allowedNextStatuses().contains(next);
    }
}
