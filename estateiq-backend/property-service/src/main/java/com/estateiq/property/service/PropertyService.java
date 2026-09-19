package com.estateiq.property.service;

import com.estateiq.common.dto.PagedResponse;
import com.estateiq.property.dto.PropertyRequest;
import com.estateiq.property.dto.PropertyResponse;
import com.estateiq.property.dto.PropertyUpdateRequest;
import com.estateiq.property.dto.PublicPropertyResponse;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface PropertyService {
    PropertyResponse create(PropertyRequest request);
    PropertyResponse get(UUID id);
    PagedResponse<PropertyResponse> list(Pageable pageable);
    PropertyResponse update(UUID id, PropertyUpdateRequest request);
    void delete(UUID id);
    PagedResponse<PublicPropertyResponse> searchPublic(String city, String listingType, String propertyType,
                                                        java.math.BigDecimal minPrice, java.math.BigDecimal maxPrice,
                                                        Pageable pageable);
}