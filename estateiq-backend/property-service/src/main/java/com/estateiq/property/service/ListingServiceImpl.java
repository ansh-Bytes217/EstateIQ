package com.estateiq.property.service;

import com.estateiq.common.exception.InvalidStateTransitionException;
import com.estateiq.common.exception.ResourceNotFoundException;
import com.estateiq.common.security.CurrentUserProvider;
import com.estateiq.property.dto.ListingRequest;
import com.estateiq.property.dto.ListingResponse;
import com.estateiq.property.entity.Listing;
import com.estateiq.property.entity.ListingStatus;
import com.estateiq.property.entity.Property;
import com.estateiq.property.repository.ListingRepository;
import com.estateiq.property.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.EnumSet;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ListingServiceImpl implements ListingService {
    private final ListingRepository listingRepository;
    private final PropertyRepository propertyRepository;
    private final CurrentUserProvider currentUserProvider;

    @Override
    public ListingResponse create(UUID propertyId, ListingRequest request) {
        Property property = findProperty(propertyId);
        Listing listing = Listing.builder().id(UUID.randomUUID()).property(property)
                .listingType(request.getListingType()).status(ListingStatus.DRAFT)
                .price(request.getPrice()).currency(request.getCurrency())
                .expiresAt(request.getExpiresAt()).build();
        return toResponse(listingRepository.save(listing));
    }

    @Override
    @Transactional(readOnly = true)
    public ListingResponse get(UUID listingId) {
        return toResponse(findListing(listingId));
    }

    @Override
    public ListingResponse transition(UUID listingId, ListingStatus targetStatus) {
        Listing listing = findListing(listingId);
        ListingStatus current = listing.getStatus();
        if (!allowedTargets(current).contains(targetStatus)) {
            throw new InvalidStateTransitionException("Listing", current.name(), targetStatus.name());
        }
        listing.setStatus(targetStatus);
        listing.setListedAt(targetStatus == ListingStatus.ACTIVE ? Instant.now() : listing.getListedAt());
        return toResponse(listingRepository.save(listing));
    }

    private Property findProperty(UUID propertyId) {
        if (currentUserProvider.isAdmin()) {
            return propertyRepository.findById(propertyId)
                    .orElseThrow(() -> new ResourceNotFoundException("Property not found: " + propertyId));
        }
        return propertyRepository.findByIdAndOwnerSubject(propertyId, currentUserProvider.getRequiredUserSubject())
                .orElseThrow(() -> new ResourceNotFoundException("Property not found: " + propertyId));
    }

    private Listing findListing(UUID listingId) {
        if (currentUserProvider.isAdmin()) {
            return listingRepository.findById(listingId)
                    .orElseThrow(() -> new ResourceNotFoundException("Listing not found: " + listingId));
        }
        return listingRepository.findByIdAndPropertyOwnerSubject(listingId, currentUserProvider.getRequiredUserSubject())
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found: " + listingId));
    }

    private EnumSet<ListingStatus> allowedTargets(ListingStatus status) {
        return switch (status) {
            case DRAFT -> EnumSet.of(ListingStatus.ACTIVE, ListingStatus.CANCELLED);
            case ACTIVE -> EnumSet.of(ListingStatus.PAUSED, ListingStatus.SOLD, ListingStatus.RENTED, ListingStatus.EXPIRED, ListingStatus.CANCELLED);
            case PAUSED -> EnumSet.of(ListingStatus.ACTIVE, ListingStatus.CANCELLED);
            default -> EnumSet.noneOf(ListingStatus.class);
        };
    }

    private ListingResponse toResponse(Listing listing) {
        return ListingResponse.builder().id(listing.getId()).propertyId(listing.getProperty().getId())
                .listingType(listing.getListingType()).status(listing.getStatus()).price(listing.getPrice())
                .currency(listing.getCurrency()).listedAt(listing.getListedAt()).expiresAt(listing.getExpiresAt())
                .createdAt(listing.getCreatedAt()).updatedAt(listing.getUpdatedAt()).build();
    }
}