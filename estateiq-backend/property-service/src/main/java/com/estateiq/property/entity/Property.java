package com.estateiq.property.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "properties")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Property {

    @Id
    private UUID id;

    @Column(name = "owner_subject", nullable = false, length = 255)
    private String ownerSubject;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "property_type", length = 50)
    private PropertyType propertyType;

    @Enumerated(EnumType.STRING)
    @Column(name = "listing_type", length = 50)
    private ListingType listingType;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private PropertyStatus status;

    @Column(precision = 19, scale = 2)
    private BigDecimal price;

    @Column(length = 10)
    private String currency;

    private Integer bedrooms;
    
    private Integer bathrooms;

    @Column(name = "area_sqft", precision = 10, scale = 2)
    private BigDecimal areaSqft;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String locality;

    @Column(name = "year_built")
    private Integer yearBuilt;

    private Integer floor;

    private boolean parking;

    private boolean furnished;

    private BigDecimal latitude;

    private BigDecimal longitude;

    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Listing> listings = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
