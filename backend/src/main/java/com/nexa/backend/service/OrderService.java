package com.nexa.backend.service;

import com.nexa.backend.entity.Order;
import com.nexa.backend.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    public Order cancelOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus() != Order.Status.PENDING &&
                order.getStatus() != Order.Status.PROCESSING) {
            throw new RuntimeException(
                    "Order cannot be cancelled because its status is " + order.getStatus()
            );
        }

        order.setStatus(Order.Status.CANCELLED);

        return orderRepository.save(order);
    }
}