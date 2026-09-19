package com.estateiq.property.repository;

import com.estateiq.property.entity.Property;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;
import java.math.BigDecimal;
import com.estateiq.property.entity.ListingStatus;
import com.estateiq.property.entity.ListingType;
import com.estateiq.property.entity.PropertyType;

public interface PropertyRepository extends JpaRepository<Property, UUID> {
    Optional<Property> findByIdAndOwnerSubject(UUID id, String ownerSubject);
    Page<Property> findAllByOwnerSubject(String ownerSubject, Pageable pageable);

    @Query("select distinct p from Property p join Listing l on l.property.id = p.id " +
            "where l.status = :listingStatus " +
            "and (:listingType is null or l.listingType = :listingType) " +
            "and (:propertyType is null or p.propertyType = :propertyType) " +
            "and (:city is null or lower(p.city) like lower(concat('%', :city, '%')) " +
            "or lower(p.locality) like lower(concat('%', :city, '%'))) " +
            "and (:minPrice is null or l.price >= :minPrice) " +
            "and (:maxPrice is null or l.price <= :maxPrice)")
    Page<Property> searchPublic(@Param("listingStatus") ListingStatus listingStatus,
                                 @Param("listingType") ListingType listingType,
                                 @Param("propertyType") PropertyType propertyType,
                                 @Param("city") String city,
                                 @Param("minPrice") BigDecimal minPrice,
                                 @Param("maxPrice") BigDecimal maxPrice,
                                 Pageable pageable);
}