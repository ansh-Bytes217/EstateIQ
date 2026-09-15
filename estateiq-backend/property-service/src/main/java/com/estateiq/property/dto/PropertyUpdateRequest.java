package com.estateiq.property.dto;

import com.estateiq.property.entity.PropertyType;
import jakarta.validation.constraints.DecimalMin;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PropertyUpdateRequest {
    private String title;
    private String description;
    private PropertyType propertyType;
    private Integer bedrooms;
    private Integer bathrooms;
    @DecimalMin("0.0") private BigDecimal areaSqft;
    private String city;
    private String locality;
    private Integer yearBuilt;
    private Integer floor;
    private Boolean parking;
    private Boolean furnished;
    private BigDecimal latitude;
    private BigDecimal longitude;
}