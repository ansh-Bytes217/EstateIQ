package com.estateiq.property.dto;

import com.estateiq.property.entity.ListingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ListingStatusRequest {
    @NotNull private ListingStatus status;
}