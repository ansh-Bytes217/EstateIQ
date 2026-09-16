package com.estateiq.generator;

import com.estateiq.generator.domain.PropertyCatalog;

import java.util.HashSet;
import java.util.Set;

public final class GeneratedDataValidator {
    private final Set<String> cityLocalities = new HashSet<>();

    public GeneratedDataValidator() {
        PropertyCatalog.profiles().forEach(city -> city.localities().forEach(locality -> cityLocalities.add(city.city() + "|" + locality.locality())));
    }

    public void validate(GeneratedBatch batch) {
        Set<java.util.UUID> propertyIds = new HashSet<>();
        for (PropertyRecord property : batch.properties()) {
            if (property.id() == null || property.ownerSubject() == null || property.title() == null || property.title().isBlank()) {
                throw new IllegalArgumentException("Property has missing required fields: " + property.id());
            }
            if (!SyntheticDataGenerator.isKnownPropertyType(property.propertyType()) || !"ACTIVE".equals(property.status())) {
                throw new IllegalArgumentException("Invalid property enum for " + property.id());
            }
            if (property.areaSqft().signum() <= 0 || property.bedrooms() < 0 || property.bathrooms() < 0
                    || property.latitude().doubleValue() < -90 || property.latitude().doubleValue() > 90
                    || property.longitude().doubleValue() < -180 || property.longitude().doubleValue() > 180
                    || !cityLocalities.contains(property.city() + "|" + property.locality())) {
                throw new IllegalArgumentException("Invalid property values for " + property.id());
            }
            propertyIds.add(property.id());
        }
        for (ListingRecord listing : batch.listings()) {
            if (!propertyIds.contains(listing.propertyId()) || listing.price().signum() <= 0
                    || !Set.of("SALE", "RENT", "NEW_CONSTRUCTION").contains(listing.listingType())
                    || !Set.of("ACTIVE", "DRAFT").contains(listing.status())
                    || !"INR".equals(listing.currency())) {
                throw new IllegalArgumentException("Invalid listing values for " + listing.id());
            }
        }
    }
}
