package com.shekhar.SpringBoot_ecom.service;


import com.shekhar.SpringBoot_ecom.model.DTO.OrderItemRequest;
import com.shekhar.SpringBoot_ecom.model.DTO.OrderItemResponse;
import com.shekhar.SpringBoot_ecom.model.DTO.OrderRequest;
import com.shekhar.SpringBoot_ecom.model.DTO.OrderResponse;
import com.shekhar.SpringBoot_ecom.model.Order;
import com.shekhar.SpringBoot_ecom.model.OrderItem;
import com.shekhar.SpringBoot_ecom.model.OrderStatus;
import com.shekhar.SpringBoot_ecom.model.Product;
import com.shekhar.SpringBoot_ecom.repo.OrderRepo;
import com.shekhar.SpringBoot_ecom.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    @Autowired
    private ProductRepo  productRepo;

    @Autowired
    private OrderRepo orderRepo;
    // ── Get logged-in username from Security Context ──────────────────
    private String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            return auth.getName();
        }
        return null;
    }

    // ── Helper — convert Order to OrderResponse ───────────────────────
    private OrderResponse mapToResponse(Order order) {
        List<OrderItemResponse> itemResponses = new ArrayList<>();
        for (OrderItem item : order.getOrderItems()) {
            itemResponses.add(new OrderItemResponse(
                    item.getProduct().getName(),
                    item.getQuantity(),
                    item.getTotalPrice()
            ));
        }
        return new OrderResponse(
                order.getOrderId(),
                order.getCustomerName(),
                order.getEmail(),
                order.getStatus().name(),          // enum → String for response
                order.getOrderDate().atStartOfDay(),
                itemResponses
        );
    }

    // ── Place Order ───────────────────────────────────────────────────
    public OrderResponse PlaceOrder(OrderRequest orderRequest) {
        Order order = new Order();
        String orderId = UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        order.setOrderId(orderId);
        order.setCustomerName(orderRequest.customerName());
        order.setEmail(orderRequest.email());
        order.setStatus(OrderStatus.PLACED);        // enum instead of String "Placed"
        order.setOrderDate(LocalDate.now());
        order.setUsername(getCurrentUsername());

        List<OrderItem> orderItemList = new ArrayList<>();
        for (OrderItemRequest itemRequest : orderRequest.items()) {
            Product product = productRepo.findById(itemRequest.productId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            product.setStockQuantity(product.getStockQuantity() - itemRequest.quantity());
            productRepo.save(product);

            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .quantity(itemRequest.quantity())
                    .totalPrice(product.getPrice().multiply(BigDecimal.valueOf(itemRequest.quantity())))
                    .order(order)
                    .build();

            orderItemList.add(orderItem);
        }

        order.setOrderItems(orderItemList);
        Order savedOrder = orderRepo.save(order);
        return mapToResponse(savedOrder);
    }

    // ── Get All Orders ────────────────────────────────────────────────
    public List<OrderResponse> getAllOrderResponses() {
        List<Order> orders = orderRepo.findAll();
        List<OrderResponse> responses = new ArrayList<>();
        for (Order order : orders) {
            responses.add(mapToResponse(order));
        }
        return responses;
    }

    // ── Get My Orders (USER) ──────────────────────────────────────────
    public List<OrderResponse> getMyOrders() {
        String username = getCurrentUsername();
        if (username == null) {
            throw new RuntimeException("User not authenticated");
        }
        List<Order> orders = orderRepo.findByUsername(username);
        List<OrderResponse> responses = new ArrayList<>();
        for (Order order : orders) {
            responses.add(mapToResponse(order));
        }
        return responses;
    }

    // ── Update Order Status ───────────────────────────────────────────
    public OrderResponse updateOrderStatus(String orderId, OrderStatus newStatus) {
        // 1. Find order
        Order order = orderRepo.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        OrderStatus currentStatus = order.getStatus();

        // 2. Validate transition using state machine
        if (!currentStatus.canTransitionTo(newStatus)) {
            throw new IllegalArgumentException(
                    "Invalid status transition: cannot move from "
                            + currentStatus + " to " + newStatus
                            + ". Allowed next statuses: " + currentStatus.allowedNextStatuses()
            );
        }

        // 3. Update and save
        order.setStatus(newStatus);
        Order updatedOrder = orderRepo.save(order);
        return mapToResponse(updatedOrder);
    }
}

