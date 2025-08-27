package com.foodapp.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RemoveFromCartRequest {
    @NotNull
    private Long cartItemId;
}

