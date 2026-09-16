package com.estateiq.generator;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record ListingRecord(
        UUID id,
        UUID propertyId,
        String listingType,
        String status,
        BigDecimal price,
        String currency,
        Instant listedAt,
        Instant expiresAt,
        Instant createdAt,
        Instant updatedAt) {
}
