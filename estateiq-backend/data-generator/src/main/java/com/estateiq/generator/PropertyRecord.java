package com.estateiq.generator;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record PropertyRecord(
        UUID id,
        String ownerSubject,
        String title,
        String description,
        String propertyType,
        String status,
        int bedrooms,
        int bathrooms,
        BigDecimal areaSqft,
        String city,
        String locality,
        int yearBuilt,
        int floor,
        boolean parking,
        boolean furnished,
        BigDecimal latitude,
        BigDecimal longitude,
        Instant createdAt,
        Instant updatedAt) {
}
