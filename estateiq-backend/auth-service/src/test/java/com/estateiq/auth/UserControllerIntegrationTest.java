package com.estateiq.auth;

import com.estateiq.auth.dto.UpdateUserRequest;
import com.estateiq.auth.entity.User;
import com.estateiq.auth.entity.UserStatus;
import com.estateiq.auth.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerIntegrationTest {

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", () -> "jdbc:h2:mem:estateiq_auth_test;MODE=PostgreSQL;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE");
        registry.add("spring.datasource.username", () -> "sa");
        registry.add("spring.datasource.password", () -> "");
        registry.add("spring.datasource.driver-class-name", () -> "org.h2.Driver");
        registry.add("spring.jpa.database-platform", () -> "org.hibernate.dialect.H2Dialect");
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "create-drop");
        registry.add("spring.flyway.enabled", () -> "false");
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void whenAnonymous_thenReturns401() throws Exception {
        mockMvc.perform(get("/api/v1/users/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("UNAUTHORIZED"));
    }

    @Test
    void whenFirstAuthenticatedAccess_thenProvisionsUser() throws Exception {
        String sub = UUID.randomUUID().toString();
        String email = "john.doe@example.com";

        mockMvc.perform(get("/api/v1/users/me")
                        .with(jwt().jwt(builder -> builder
                                .subject(sub)
                                .claim("email", email)
                                .claim("given_name", "John")
                                .claim("family_name", "Doe")
                        ).authorities(new SimpleGrantedAuthority("ROLE_BUYER"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.keycloakSubject").value(sub))
                .andExpect(jsonPath("$.email").value(email))
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.lastName").value("Doe"))
                .andExpect(jsonPath("$.status").value("ACTIVE"));

        Optional<User> saved = userRepository.findByKeycloakSubject(sub);
        assertThat(saved).isPresent();
        assertThat(saved.get().getEmail()).isEqualTo(email);
    }

    @Test
    void whenSubsequentAuthenticatedAccess_thenReturnsExistingUser() throws Exception {
        String sub = UUID.randomUUID().toString();
        User existingUser = userRepository.save(User.builder()
                .id(UUID.randomUUID())
                .keycloakSubject(sub)
                .email("existing@example.com")
                .firstName("Existing")
                .lastName("User")
                .status(UserStatus.ACTIVE)
                .build());

        mockMvc.perform(get("/api/v1/users/me")
                        .with(jwt().jwt(builder -> builder.subject(sub))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(existingUser.getId().toString()))
                .andExpect(jsonPath("$.keycloakSubject").value(sub))
                .andExpect(jsonPath("$.email").value("existing@example.com"));

        assertThat(userRepository.count()).isEqualTo(1);
    }

    @Test
    void whenUpdateProfile_thenUpdatesFields() throws Exception {
        String sub = UUID.randomUUID().toString();
        UpdateUserRequest updateRequest = UpdateUserRequest.builder()
                .firstName("UpdatedFirst")
                .lastName("UpdatedLast")
                .phone("+1234567890")
                .build();

        mockMvc.perform(patch("/api/v1/users/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest))
                        .with(jwt().jwt(builder -> builder.subject(sub).claim("email", "update@example.com"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("UpdatedFirst"))
                .andExpect(jsonPath("$.lastName").value("UpdatedLast"))
                .andExpect(jsonPath("$.phone").value("+1234567890"));

        User user = userRepository.findByKeycloakSubject(sub).orElseThrow();
        assertThat(user.getFirstName()).isEqualTo("UpdatedFirst");
        assertThat(user.getPhone()).isEqualTo("+1234567890");
    }
}
