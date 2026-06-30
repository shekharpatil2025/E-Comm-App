package com.shekhar.SpringBoot_ecom.repo;

import com.shekhar.SpringBoot_ecom.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepo extends JpaRepository<Order, Integer>
{

    Optional<Order> findByorderId(String orderId);
}
