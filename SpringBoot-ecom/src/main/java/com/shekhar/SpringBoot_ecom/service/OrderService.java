package com.shekhar.SpringBoot_ecom.service;


import com.shekhar.SpringBoot_ecom.model.DTO.OrderItemRequest;
import com.shekhar.SpringBoot_ecom.model.DTO.OrderItemResponse;
import com.shekhar.SpringBoot_ecom.model.DTO.OrderRequest;
import com.shekhar.SpringBoot_ecom.model.DTO.OrderResponse;
import com.shekhar.SpringBoot_ecom.model.Order;
import com.shekhar.SpringBoot_ecom.model.OrderItem;
import com.shekhar.SpringBoot_ecom.model.Product;
import com.shekhar.SpringBoot_ecom.repo.OrderRepo;
import com.shekhar.SpringBoot_ecom.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
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

    public OrderResponse PlaceOrder(OrderRequest orderRequest) {
        Order order=new Order();
        String orderId= UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        order.setOrderId(orderId);
        order.setCustomerName(orderRequest.customerName());
        order.setEmail(orderRequest.email());
        order.setStatus("Placed");
        order.setOrderDate(LocalDate.now());

        List<OrderItem> orderItemList=new ArrayList<>();
        for(OrderItemRequest itemRequest:orderRequest.items()){
            Product product=productRepo.findById(itemRequest.productId())
                    .orElseThrow(()->new RuntimeException("Product not found"));


            product.setStockQuantity(product.getStockQuantity()-itemRequest.quantity());
            productRepo.save(product);

            OrderItem orderItem=OrderItem.builder()
                    .product(product)
                    .quantity(itemRequest.quantity())
                    .totalPrice(product.getPrice().multiply(BigDecimal.valueOf(itemRequest.quantity())))
                    .order(order)
                    .build();

            orderItemList.add(orderItem);
        }

        order.setOrderItems(orderItemList);
        Order SavedOrder=orderRepo.save(order);

        List<OrderItemResponse> orderItemResponses=new ArrayList<>();
        for(OrderItem  orderItem:order.getOrderItems()){
            OrderItemResponse orderItemResponse=new OrderItemResponse(
                    orderItem.getProduct().getName(),
                    orderItem.getQuantity(),
                    orderItem.getTotalPrice()
            );
            orderItemResponses.add(orderItemResponse);
        }
        OrderResponse orderResponse=new OrderResponse(
                SavedOrder.getOrderId(),
                SavedOrder.getCustomerName(),
                SavedOrder.getEmail(),
                SavedOrder.getStatus(),
                SavedOrder.getOrderDate().atStartOfDay(),
                orderItemResponses
        );
        return orderResponse;


    }

    public List<OrderResponse> getAllOrderResponses() {
        List<Order>  orders=orderRepo.findAll();
        List<OrderResponse> orderResponses=new ArrayList<>();


        for(Order order:orders){

            List<OrderItemResponse> orderItemResponses=new ArrayList<>();
            for(OrderItem  orderItem:order.getOrderItems()) {
                OrderItemResponse orderItemResponse = new OrderItemResponse(
                        orderItem.getProduct().getName(),
                        orderItem.getQuantity(),
                        orderItem.getTotalPrice()
                );
                orderItemResponses.add(orderItemResponse);
            }

            OrderResponse orderResponse=new OrderResponse(
                    order.getOrderId(),
                    order.getCustomerName(),
                    order.getEmail(),
                    order.getStatus(),
                    order.getOrderDate().atStartOfDay(),
                    orderItemResponses
            );
             orderResponses.add(orderResponse);
        }

        return orderResponses;
    }
}
