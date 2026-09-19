package com.estateiq.property.service;

import com.estateiq.common.dto.PagedResponse;
import com.estateiq.common.exception.ResourceNotFoundException;
import com.estateiq.common.security.CurrentUserProvider;
import com.estateiq.property.dto.PropertyRequest;
import com.estateiq.property.dto.PropertyResponse;
import com.estateiq.property.dto.PropertyUpdateRequest;
import com.estateiq.property.dto.PublicPropertyResponse;
import com.estateiq.property.entity.Listing;
import com.estateiq.property.entity.ListingStatus;
import com.estateiq.property.entity.ListingType;
import com.estateiq.property.entity.PropertyType;
import com.estateiq.property.entity.Property;
import com.estateiq.property.entity.PropertyStatus;
import com.estateiq.property.repository.PropertyRepository;
import com.estateiq.property.repository.ListingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PropertyServiceImpl implements PropertyService {
    private final PropertyRepository propertyRepository;
    private final ListingRepository listingRepository;
    private final CurrentUserProvider currentUserProvider;
    private final AuditEventService auditEventService;

    @Override
    public PropertyResponse create(PropertyRequest request) {
        Property property = new Property();
        property.setId(UUID.randomUUID());
        property.setOwnerSubject(currentUserProvider.getRequiredUserSubject());
        property.setStatus(PropertyStatus.DRAFT);
        apply(property, request);
        PropertyResponse response = toResponse(propertyRepository.save(property));
        auditEventService.record("PROPERTY_CREATED", "PROPERTY", response.getId(), response.getStatus().name());
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public PropertyResponse get(UUID id) {
        return toResponse(findOwned(id));
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<PropertyResponse> list(Pageable pageable) {
        String subject = currentUserProvider.getRequiredUserSubject();
        var page = currentUserProvider.isAdmin()
                ? propertyRepository.findAll(pageable)
                : propertyRepository.findAllByOwnerSubject(subject, pageable);
        return PagedResponse.from(page.map(this::toResponse));
    }

    @Override
    public PropertyResponse update(UUID id, PropertyUpdateRequest request) {
        Property property = findOwned(id);
        if (request.getTitle() != null) property.setTitle(request.getTitle());
        if (request.getDescription() != null) property.setDescription(request.getDescription());
        if (request.getPropertyType() != null) property.setPropertyType(request.getPropertyType());
        if (request.getBedrooms() != null) property.setBedrooms(request.getBedrooms());
        if (request.getBathrooms() != null) property.setBathrooms(request.getBathrooms());
        if (request.getAreaSqft() != null) property.setAreaSqft(request.getAreaSqft());
        if (request.getCity() != null) property.setCity(request.getCity());
        if (request.getLocality() != null) property.setLocality(request.getLocality());
        if (request.getYearBuilt() != null) property.setYearBuilt(request.getYearBuilt());
        if (request.getFloor() != null) property.setFloor(request.getFloor());
        if (request.getParking() != null) property.setParking(request.getParking());
        if (request.getFurnished() != null) property.setFurnished(request.getFurnished());
        if (request.getLatitude() != null) property.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) property.setLongitude(request.getLongitude());
        return toResponse(propertyRepository.save(property));
    }

    @Override
    public void delete(UUID id) {
        propertyRepository.delete(findOwned(id));
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<PublicPropertyResponse> searchPublic(String city, String listingType, String propertyType,
                                                               java.math.BigDecimal minPrice, java.math.BigDecimal maxPrice,
                                                               Pageable pageable) {
        ListingType requestedListingType = parseEnum(listingType, ListingType.class);
        PropertyType requestedPropertyType = parseEnum(propertyType, PropertyType.class);
        var page = propertyRepository.searchPublic(ListingStatus.ACTIVE, requestedListingType, requestedPropertyType,
                blankToNull(city), minPrice, maxPrice, pageable);
        return PagedResponse.from(page.map(property -> listingRepository
                .findFirstByPropertyIdAndStatusOrderByCreatedAtDesc(property.getId(), ListingStatus.ACTIVE)
                .map(listing -> toPublicResponse(property, listing))
                .orElseThrow()));
    }

    private Property findOwned(UUID id) {
        if (currentUserProvider.isAdmin()) {
            return propertyRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Property not found: " + id));
        }
        return propertyRepository.findByIdAndOwnerSubject(id, currentUserProvider.getRequiredUserSubject())
                .orElseThrow(() -> new ResourceNotFoundException("Property not found: " + id));
    }

    private void apply(Property property, PropertyRequest request) {
        property.setTitle(request.getTitle());
        property.setDescription(request.getDescription());
        property.setPropertyType(request.getPropertyType());
        property.setBedrooms(request.getBedrooms());
        property.setBathrooms(request.getBathrooms());
        property.setAreaSqft(request.getAreaSqft());
        property.setCity(request.getCity());
        property.setLocality(request.getLocality());
        property.setYearBuilt(request.getYearBuilt());
        property.setFloor(request.getFloor());
        property.setParking(request.isParking());
        property.setFurnished(request.isFurnished());
        property.setLatitude(request.getLatitude());
        property.setLongitude(request.getLongitude());
    }

    private PropertyResponse toResponse(Property property) {
        return PropertyResponse.builder()
                .id(property.getId()).ownerSubject(property.getOwnerSubject()).title(property.getTitle())
                .description(property.getDescription()).propertyType(property.getPropertyType())
                .status(property.getStatus()).bedrooms(property.getBedrooms()).bathrooms(property.getBathrooms())
                .areaSqft(property.getAreaSqft()).city(property.getCity()).locality(property.getLocality())
                .yearBuilt(property.getYearBuilt()).floor(property.getFloor()).parking(property.isParking())
                .furnished(property.isFurnished()).latitude(property.getLatitude()).longitude(property.getLongitude())
                .createdAt(property.getCreatedAt()).updatedAt(property.getUpdatedAt()).build();
    }

    private PublicPropertyResponse toPublicResponse(Property property, Listing listing) {
        return PublicPropertyResponse.builder().id(property.getId()).title(property.getTitle())
                .description(property.getDescription()).propertyType(property.getPropertyType())
                .listingType(listing.getListingType()).listingStatus(listing.getStatus()).price(listing.getPrice())
                .currency(listing.getCurrency()).bedrooms(property.getBedrooms()).bathrooms(property.getBathrooms())
                .areaSqft(property.getAreaSqft()).city(property.getCity()).locality(property.getLocality())
                .yearBuilt(property.getYearBuilt()).floor(property.getFloor()).parking(property.isParking())
                .furnished(property.isFurnished()).latitude(property.getLatitude()).longitude(property.getLongitude())
                .listedAt(listing.getListedAt()).build();
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value;
    }

    private <T extends Enum<T>> T parseEnum(String value, Class<T> enumType) {
        if (value == null || value.isBlank()) return null;
        return Enum.valueOf(enumType, value.trim().toUpperCase().replace('-', '_').replace(' ', '_'));
    }
}