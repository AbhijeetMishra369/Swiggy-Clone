package com.foodapp.api;

import com.foodapp.domain.AppUser;
import com.foodapp.domain.Cart;
import com.foodapp.dto.AddToCartRequest;
import com.foodapp.dto.RemoveFromCartRequest;
import com.foodapp.repository.AppUserRepository;
import com.foodapp.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final AppUserRepository appUserRepository;

    private AppUser currentUser(Authentication auth) {
        return appUserRepository.findByEmail(auth.getName()).orElseThrow();
    }

    @PostMapping("/add")
    public ResponseEntity<Cart> add(@Valid @RequestBody AddToCartRequest req, Authentication auth) {
        Cart cart = cartService.addItem(currentUser(auth), req.getMenuItemId(), req.getQuantity());
        return ResponseEntity.ok(cart);
    }

    @GetMapping("/view")
    public ResponseEntity<Cart> view(Authentication auth) {
        return ResponseEntity.ok(cartService.view(currentUser(auth)));
    }

    @GetMapping
    public ResponseEntity<Cart> viewAlias(Authentication auth) {
        return ResponseEntity.ok(cartService.view(currentUser(auth)));
    }

    @PostMapping("/remove")
    public ResponseEntity<?> remove(@Valid @RequestBody RemoveFromCartRequest req, Authentication auth) {
        cartService.removeItem(currentUser(auth), req.getCartItemId());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<?> removePath(@PathVariable Long itemId, Authentication auth) {
        cartService.removeItem(currentUser(auth), itemId);
        return ResponseEntity.ok().build();
    }
}