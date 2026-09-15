package com.estateiq.property.dto;

import com.estateiq.property.entity.ListingType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;

@Data
public class ListingRequest {
    @NotNull private ListingType listingType;
    @NotNull @DecimalMin("0.01") private BigDecimal price;
    @NotNull private String currency;
    private Instant expiresAt;
}