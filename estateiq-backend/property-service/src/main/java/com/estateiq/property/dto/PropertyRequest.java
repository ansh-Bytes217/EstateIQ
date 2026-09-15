package com.estateiq.property.dto;

import com.estateiq.property.entity.ListingType;
import com.estateiq.property.entity.PropertyType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PropertyRequest {
    @NotBlank private String title;
    private String description;
    @NotNull private PropertyType propertyType;
    @NotNull private ListingType listingType;
    @DecimalMin("0.0") private BigDecimal price;
    private String currency;
    private Integer bedrooms;
    private Integer bathrooms;
    private BigDecimal areaSqft;
    private String city;
    private String locality;
    private Integer yearBuilt;
    private Integer floor;
    private boolean parking;
    private boolean furnished;
    private BigDecimal latitude;
    private BigDecimal longitude;
}