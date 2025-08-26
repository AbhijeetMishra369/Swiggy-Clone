package com.foodapp.service;

import com.foodapp.domain.*;
import com.foodapp.repository.CartRepository;
import com.foodapp.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final MenuItemRepository menuItemRepository;

    @Transactional
    public Cart addItem(AppUser user, Long menuItemId, int quantity) {
        Cart cart = cartRepository.findByUser(user).orElseGet(() -> {
            Cart c = new Cart();
            c.setUser(user);
            return cartRepository.save(c);
        });
        MenuItem menuItem = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found"));
        CartItem item = new CartItem();
        item.setCart(cart);
        item.setMenuItem(menuItem);
        item.setQuantity(quantity);
        cart.getItems().add(item);
        return cartRepository.save(cart);
    }

    public Cart view(AppUser user) {
        return cartRepository.findByUser(user).orElseGet(() -> {
            Cart c = new Cart();
            c.setUser(user);
            return cartRepository.save(c);
        });
    }

    @Transactional
    public void removeItem(AppUser user, Long cartItemId) {
        Cart cart = cartRepository.findByUser(user).orElseThrow(() -> new IllegalArgumentException("Cart not found"));
        cart.getItems().removeIf(ci -> cartItemId.equals(ci.getId()));
        cartRepository.save(cart);
    }
}