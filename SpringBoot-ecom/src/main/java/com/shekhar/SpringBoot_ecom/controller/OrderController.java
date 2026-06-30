package com.shekhar.SpringBoot_ecom.controller;

import com.shekhar.SpringBoot_ecom.model.DTO.OrderRequest;
import com.shekhar.SpringBoot_ecom.model.DTO.OrderResponse;
import com.shekhar.SpringBoot_ecom.model.OrderItem;
import com.shekhar.SpringBoot_ecom.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class OrderController {
    @Autowired
    OrderService orderService;

    @PostMapping("/orders/place")
    public ResponseEntity<OrderResponse> PlaceOrder(@RequestBody OrderRequest orderRequest) {
        OrderResponse orderResponse=orderService.PlaceOrder(orderRequest);
        return new ResponseEntity<>(orderResponse, HttpStatus.CREATED);
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getAllOrder() {
        List<OrderResponse> orderResponse=orderService.getAllOrderResponses();
        return new ResponseEntity<>(orderResponse, HttpStatus.CREATED);
    }
}
