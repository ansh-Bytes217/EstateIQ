package com.estateiq.property;

import com.estateiq.property.dto.ListingRequest;
import com.estateiq.property.dto.PropertyRequest;
import com.estateiq.property.dto.PropertyUpdateRequest;
import com.estateiq.property.entity.Listing;
import com.estateiq.property.entity.ListingStatus;
import com.estateiq.property.entity.ListingType;
import com.estateiq.property.entity.PropertyType;
import com.estateiq.property.repository.ListingRepository;
import com.estateiq.property.repository.PropertyRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class PropertyControllerIntegrationTest {

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", () -> "jdbc:h2:mem:estateiq_property_test;MODE=PostgreSQL;INIT=CREATE SCHEMA IF NOT EXISTS property;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE");
        registry.add("spring.datasource.username", () -> "sa");
        registry.add("spring.datasource.password", () -> "");
        registry.add("spring.datasource.driver-class-name", () -> "org.h2.Driver");
        registry.add("spring.jpa.database-platform", () -> "org.hibernate.dialect.H2Dialect");
        registry.add("spring.jpa.properties.hibernate.default_schema", () -> "property");
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "create-drop");
        registry.add("spring.flyway.enabled", () -> "false");
    }

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private PropertyRepository propertyRepository;
    @Autowired private ListingRepository listingRepository;
        @MockBean private JwtDecoder jwtDecoder;

    @BeforeEach
    void setUp() {
        listingRepository.deleteAll();
        propertyRepository.deleteAll();
    }

    @Test
    void anonymousCannotCreateProperty() throws Exception {
        mockMvc.perform(post("/api/v1/properties").contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(propertyRequest())))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void ownerCanCreateAndReadProperty() throws Exception {
        String subject = UUID.randomUUID().toString();
        String body = objectMapper.writeValueAsString(propertyRequest());

        String response = mockMvc.perform(post("/api/v1/properties").contentType(MediaType.APPLICATION_JSON).content(body)
                        .with(jwt().jwt(jwt -> jwt.subject(subject))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.ownerSubject").value(subject))
                .andExpect(jsonPath("$.status").value("DRAFT"))
                .andReturn().getResponse().getContentAsString();

        UUID id = UUID.fromString(objectMapper.readTree(response).get("id").asText());
        mockMvc.perform(get("/api/v1/properties/" + id).with(jwt().jwt(jwt -> jwt.subject(subject))))
                .andExpect(status().isOk()).andExpect(jsonPath("$.title").value("City apartment"));
    }

    @Test
    void anonymousCanSearchActiveListings() throws Exception {
        var property = propertyRepository.save(com.estateiq.property.entity.Property.builder()
                .id(UUID.randomUUID()).ownerSubject("search-owner").title("Public search home")
                .propertyType(PropertyType.APARTMENT).city("Mumbai").locality("Worli")
                .status(com.estateiq.property.entity.PropertyStatus.DRAFT).build());
        listingRepository.save(Listing.builder().id(UUID.randomUUID()).property(property)
                .listingType(ListingType.SALE).status(ListingStatus.ACTIVE)
                .price(new BigDecimal("25000000")).currency("INR").build());

        mockMvc.perform(get("/api/v1/properties/search?city=Mumbai&listingType=SALE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(1))
                .andExpect(jsonPath("$.items[0].title").value("Public search home"))
                .andExpect(jsonPath("$.items[0].price").value(25000000));
    }

    @Test
    void anotherOwnerCannotReadProperty() throws Exception {
        var property = propertyRepository.save(com.estateiq.property.entity.Property.builder()
                .id(UUID.randomUUID()).ownerSubject("owner-a").title("Private home")
                .propertyType(PropertyType.VILLA)
                .status(com.estateiq.property.entity.PropertyStatus.DRAFT).build());

        mockMvc.perform(get("/api/v1/properties/" + property.getId())
                        .with(jwt().jwt(jwt -> jwt.subject("owner-b"))))
                .andExpect(status().isNotFound());
    }

    @Test
    void ownerCanCreateAndActivateListing() throws Exception {
        String subject = "listing-owner";
        var property = propertyRepository.save(com.estateiq.property.entity.Property.builder()
                .id(UUID.randomUUID()).ownerSubject(subject).title("Listing home")
                .propertyType(PropertyType.APARTMENT)
                .status(com.estateiq.property.entity.PropertyStatus.DRAFT).build());
        ListingRequest request = new ListingRequest();
        request.setListingType(ListingType.SALE);
        request.setPrice(new BigDecimal("250000.00"));
        request.setCurrency("USD");

        String response = mockMvc.perform(post("/api/v1/properties/" + property.getId() + "/listings")
                        .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(request))
                        .with(jwt().jwt(jwt -> jwt.subject(subject))))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.status").value("DRAFT"))
                .andReturn().getResponse().getContentAsString();
        UUID listingId = UUID.fromString(objectMapper.readTree(response).get("id").asText());

        mockMvc.perform(patch("/api/v1/properties/listings/" + listingId + "/status")
                        .contentType(MediaType.APPLICATION_JSON).content("{\"status\":\"ACTIVE\"}")
                        .with(jwt().jwt(jwt -> jwt.subject(subject))))
                .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("ACTIVE"));
        assertThat(listingRepository.findById(listingId).orElseThrow().getStatus()).isEqualTo(ListingStatus.ACTIVE);
    }

    @Test
    void invalidListingTransitionIsRejected() throws Exception {
        String subject = "transition-owner";
        var property = propertyRepository.save(com.estateiq.property.entity.Property.builder()
                .id(UUID.randomUUID()).ownerSubject(subject).title("Transition home")
                .propertyType(PropertyType.APARTMENT)
                .status(com.estateiq.property.entity.PropertyStatus.DRAFT).build());
        Listing listing = listingRepository.save(Listing.builder().id(UUID.randomUUID()).property(property)
                .listingType(ListingType.RENT).status(ListingStatus.SOLD).price(new BigDecimal("1000"))
                .currency("USD").build());

        mockMvc.perform(patch("/api/v1/properties/listings/" + listing.getId() + "/status")
                        .contentType(MediaType.APPLICATION_JSON).content("{\"status\":\"ACTIVE\"}")
                        .with(jwt().jwt(jwt -> jwt.subject(subject))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("INVALID_STATE_TRANSITION"));
    }

    @Test
    void ownerCanPartiallyUpdateProperty() throws Exception {
        String subject = "patch-owner";
        var property = propertyRepository.save(com.estateiq.property.entity.Property.builder()
                .id(UUID.randomUUID()).ownerSubject(subject).title("Original title")
                .description("Keep this description").propertyType(PropertyType.APARTMENT)
                .status(com.estateiq.property.entity.PropertyStatus.DRAFT).build());

        PropertyUpdateRequest request = new PropertyUpdateRequest();
        request.setDescription("Updated description");

        mockMvc.perform(patch("/api/v1/properties/" + property.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
                        .with(jwt().jwt(jwt -> jwt.subject(subject))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Original title"))
                .andExpect(jsonPath("$.description").value("Updated description"));
    }

    private PropertyRequest propertyRequest() {
        PropertyRequest request = new PropertyRequest();
        request.setTitle("City apartment");
        request.setPropertyType(PropertyType.APARTMENT);
        return request;
    }
}