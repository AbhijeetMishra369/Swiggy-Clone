package com.foodapp.service;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OrderEventService {
    private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();

    public SseEmitter subscribe(Long orderId) {
        SseEmitter emitter = new SseEmitter(0L);
        emitters.put(orderId, emitter);
        emitter.onCompletion(() -> emitters.remove(orderId));
        emitter.onTimeout(() -> emitters.remove(orderId));
        try {
            emitter.send(SseEmitter.event().name("connected").data("ok"));
        } catch (IOException ignored) {}
        return emitter;
    }

    public void emitStatus(Long orderId, String status) {
        SseEmitter emitter = emitters.get(orderId);
        if (emitter == null) return;
        try {
            emitter.send(SseEmitter.event().name("status").data(status));
        } catch (IOException e) {
            emitters.remove(orderId);
        }
    }

    public void emitLocation(Long orderId, double lat, double lng) {
        SseEmitter emitter = emitters.get(orderId);
        if (emitter == null) return;
        try {
            String payload = lat + "," + lng;
            emitter.send(SseEmitter.event().name("location").data(payload));
        } catch (IOException e) {
            emitters.remove(orderId);
        }
    }
}

