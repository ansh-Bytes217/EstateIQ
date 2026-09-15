package com.estateiq.property.repository;

import com.estateiq.property.entity.Listing;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;
import java.util.List;

public interface ListingRepository extends JpaRepository<Listing, UUID> {
    Optional<Listing> findByIdAndPropertyOwnerSubject(UUID id, String ownerSubject);
    List<Listing> findAllByPropertyId(UUID propertyId);
}