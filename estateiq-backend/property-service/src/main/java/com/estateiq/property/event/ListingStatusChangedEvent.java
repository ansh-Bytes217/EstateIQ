package com.estateiq.property.event;

import com.estateiq.property.entity.ListingStatus;

import java.time.Instant;
import java.util.UUID;

public record ListingStatusChangedEvent(
        UUID listingId,
        UUID propertyId,
        ListingStatus previousStatus,
        ListingStatus status,
        String actorSubject,
        Instant occurredAt
) {
}
