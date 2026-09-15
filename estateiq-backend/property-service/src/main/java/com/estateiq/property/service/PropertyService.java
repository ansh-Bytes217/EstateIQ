package com.estateiq.property.service;

import com.estateiq.common.dto.PagedResponse;
import com.estateiq.property.dto.PropertyRequest;
import com.estateiq.property.dto.PropertyResponse;
import com.estateiq.property.dto.PropertyUpdateRequest;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface PropertyService {
    PropertyResponse create(PropertyRequest request);
    PropertyResponse get(UUID id);
    PagedResponse<PropertyResponse> list(Pageable pageable);
    PropertyResponse update(UUID id, PropertyUpdateRequest request);
    void delete(UUID id);
}