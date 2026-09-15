package com.estateiq.auth.dto;

import com.estateiq.auth.entity.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private UUID id;
    private String keycloakSubject;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private UserStatus status;
    private Instant createdAt;
    private Instant updatedAt;
}
