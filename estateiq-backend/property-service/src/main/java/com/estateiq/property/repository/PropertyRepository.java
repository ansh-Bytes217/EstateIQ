package com.estateiq.property.repository;

import com.estateiq.property.entity.Property;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PropertyRepository extends JpaRepository<Property, UUID> {
    Optional<Property> findByIdAndOwnerSubject(UUID id, String ownerSubject);
    Page<Property> findAllByOwnerSubject(String ownerSubject, Pageable pageable);
}