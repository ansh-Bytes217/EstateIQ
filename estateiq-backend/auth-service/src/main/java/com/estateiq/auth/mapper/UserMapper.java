package com.estateiq.auth.mapper;

import com.estateiq.auth.dto.UpdateUserRequest;
import com.estateiq.auth.dto.UserResponse;
import com.estateiq.auth.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }
        return UserResponse.builder()
                .id(user.getId())
                .keycloakSubject(user.getKeycloakSubject())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    public void updateUserFromRequest(UpdateUserRequest request, User user) {
        if (request == null || user == null) {
            return;
        }
        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
    }
}
