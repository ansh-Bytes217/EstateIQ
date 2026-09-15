package com.estateiq.property.dto;

import com.estateiq.property.entity.ListingStatus;
import com.estateiq.property.entity.ListingType;
import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Value
@Builder
public class ListingResponse {
    UUID id;
    UUID propertyId;
    ListingType listingType;
    ListingStatus status;
    BigDecimal price;
    String currency;
    Instant listedAt;
    Instant expiresAt;
    Instant createdAt;
    Instant updatedAt;
}