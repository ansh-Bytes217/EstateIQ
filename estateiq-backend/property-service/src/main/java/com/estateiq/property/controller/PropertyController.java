package com.estateiq.property.controller;

import com.estateiq.common.dto.ErrorResponse;
import com.estateiq.common.dto.PagedResponse;
import com.estateiq.property.dto.ListingRequest;
import com.estateiq.property.dto.ListingResponse;
import com.estateiq.property.dto.ListingStatusRequest;
import com.estateiq.property.dto.PropertyRequest;
import com.estateiq.property.dto.PropertyResponse;
import com.estateiq.property.service.ListingService;
import com.estateiq.property.service.PropertyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/properties")
@RequiredArgsConstructor
@Tag(name = "Properties and Listings", description = "Property inventory and listing lifecycle endpoints")
@SecurityRequirement(name = "bearerAuth")
public class PropertyController {

    private final PropertyService propertyService;
    private final ListingService listingService;

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "Property Service is running"));
    }

    @Operation(summary = "Create a property")
    @ApiResponses({@ApiResponse(responseCode = "201", content = @Content(schema = @Schema(implementation = PropertyResponse.class))),
            @ApiResponse(responseCode = "400", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))})
    @PostMapping
    public ResponseEntity<PropertyResponse> create(@Valid @RequestBody PropertyRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(propertyService.create(request));
    }

    @Operation(summary = "Get a property")
    @GetMapping("/{id}")
    public PropertyResponse get(@PathVariable UUID id) { return propertyService.get(id); }

    @Operation(summary = "List owned properties")
    @GetMapping
    public PagedResponse<PropertyResponse> list(Pageable pageable) { return propertyService.list(pageable); }

    @Operation(summary = "Update a property")
    @PutMapping("/{id}")
    public PropertyResponse update(@PathVariable UUID id, @Valid @RequestBody PropertyRequest request) {
        return propertyService.update(id, request);
    }

    @Operation(summary = "Delete a property")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) { propertyService.delete(id); }

    @Operation(summary = "Create a listing for a property")
    @PostMapping("/{propertyId}/listings")
    public ResponseEntity<ListingResponse> createListing(@PathVariable UUID propertyId, @Valid @RequestBody ListingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(listingService.create(propertyId, request));
    }

    @Operation(summary = "Get a listing")
    @GetMapping("/listings/{listingId}")
    public ListingResponse getListing(@PathVariable UUID listingId) { return listingService.get(listingId); }

    @Operation(summary = "Transition a listing lifecycle status")
    @PatchMapping("/listings/{listingId}/status")
    public ListingResponse transitionListing(@PathVariable UUID listingId, @Valid @RequestBody ListingStatusRequest request) {
        return listingService.transition(listingId, request.getStatus());
    }
}
