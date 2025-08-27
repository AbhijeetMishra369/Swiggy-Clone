package com.foodapp.service;

import com.foodapp.domain.Order;
import com.foodapp.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@EnableScheduling
@RequiredArgsConstructor
@Profile("dev")
public class OrderProgressor {

    private final OrderRepository orderRepository;
    private final OrderEventService eventService;

    @Scheduled(fixedRate = 15000)
    public void progress() {
        List<Order> pending = orderRepository.findAll();
        for (Order o : pending) {
            if ("PAID".equalsIgnoreCase(o.getPaymentStatus())) {
                if ("Preparing".equalsIgnoreCase(o.getStatus())) {
                    o.setStatus("OutForDelivery");
                    orderRepository.save(o);
                    eventService.emitStatus(o.getId(), "OutForDelivery");
                } else if ("OutForDelivery".equalsIgnoreCase(o.getStatus())) {
                    o.setStatus("Delivered");
                    orderRepository.save(o);
                    eventService.emitStatus(o.getId(), "Delivered");
                }
            }
        }
    }
}

