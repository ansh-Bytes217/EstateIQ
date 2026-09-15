package com.estateiq.property.dto;

import com.estateiq.property.entity.ListingType;
import com.estateiq.property.entity.PropertyStatus;
import com.estateiq.property.entity.PropertyType;
import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Value
@Builder
public class PropertyResponse {
    UUID id;
    String ownerSubject;
    String title;
    String description;
    PropertyType propertyType;
    ListingType listingType;
    PropertyStatus status;
    BigDecimal price;
    String currency;
    Integer bedrooms;
    Integer bathrooms;
    BigDecimal areaSqft;
    String city;
    String locality;
    Integer yearBuilt;
    Integer floor;
    boolean parking;
    boolean furnished;
    BigDecimal latitude;
    BigDecimal longitude;
    Instant createdAt;
    Instant updatedAt;
}