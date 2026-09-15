package com.estateiq.property;

import com.estateiq.property.entity.Listing;
import com.estateiq.property.entity.ListingStatus;
import com.estateiq.property.entity.ListingType;
import com.estateiq.property.entity.Property;
import com.estateiq.property.entity.PropertyStatus;
import com.estateiq.property.entity.PropertyType;
import com.estateiq.property.repository.ListingRepository;
import com.estateiq.property.repository.PropertyRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.math.BigDecimal;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@Testcontainers(disabledWithoutDocker = true)
@SpringBootTest
class PropertyPostgresIntegrationTest {

    @Container
    static final PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("estateiq_test")
            .withUsername("estateiq")
            .withPassword("estateiq_password");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "validate");
        registry.add("spring.flyway.enabled", () -> "true");
    }

    @Autowired private PropertyRepository propertyRepository;
    @Autowired private ListingRepository listingRepository;
    @MockBean private JwtDecoder jwtDecoder;

    @Test
    void flywaySchemaSupportsPropertyListingAggregate() {
        Property property = propertyRepository.save(Property.builder()
                .id(UUID.randomUUID())
                .ownerSubject("postgres-owner")
                .title("PostgreSQL home")
                .propertyType(PropertyType.APARTMENT)
                .status(PropertyStatus.DRAFT)
                .build());

        Listing listing = listingRepository.save(Listing.builder()
                .id(UUID.randomUUID())
                .property(property)
                .listingType(ListingType.SALE)
                .status(ListingStatus.DRAFT)
                .price(new BigDecimal("125000.00"))
                .currency("USD")
                .build());

        assertThat(listingRepository.findAllByPropertyId(property.getId()))
                .extracting(Listing::getId)
                .containsExactly(listing.getId());
    }
}
