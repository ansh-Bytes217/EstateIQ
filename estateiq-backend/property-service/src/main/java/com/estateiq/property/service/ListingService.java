package com.estateiq.property.service;

import com.estateiq.property.dto.ListingRequest;
import com.estateiq.property.dto.ListingResponse;
import com.estateiq.property.entity.ListingStatus;

import java.util.UUID;

public interface ListingService {
    ListingResponse create(UUID propertyId, ListingRequest request);
    ListingResponse get(UUID listingId);
    ListingResponse transition(UUID listingId, ListingStatus targetStatus);
}