package com.estateiq.auth;

import com.estateiq.auth.entity.User;
import com.estateiq.auth.entity.UserStatus;
import com.estateiq.auth.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@Testcontainers(disabledWithoutDocker = true)
@SpringBootTest
class AuthPostgresIntegrationTest {

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

    @Autowired private UserRepository userRepository;
    @Autowired private JdbcTemplate jdbcTemplate;
    @MockBean private JwtDecoder jwtDecoder;

    @Test
    void flywaySchemaSupportsAuthAggregateWithoutPropertyTables() {
        assertThat(jdbcTemplate.queryForObject("SELECT to_regclass('auth.flyway_schema_history')", String.class))
                .isEqualTo("auth.flyway_schema_history");
        assertThat(jdbcTemplate.queryForObject("SELECT to_regclass('auth.users')", String.class))
                .isEqualTo("auth.users");
        assertThat(jdbcTemplate.queryForObject("SELECT to_regclass('property.properties')", String.class))
                .isNull();
        assertThat(jdbcTemplate.queryForObject("SELECT to_regclass('property.listings')", String.class))
                .isNull();

        User saved = userRepository.save(User.builder()
                .id(UUID.randomUUID())
                .keycloakSubject("postgres-auth-owner")
                .status(UserStatus.ACTIVE)
                .build());

        assertThat(userRepository.findById(saved.getId())).isPresent();
    }
}