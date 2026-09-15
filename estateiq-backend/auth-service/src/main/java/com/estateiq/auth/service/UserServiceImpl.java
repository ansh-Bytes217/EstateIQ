package com.estateiq.auth.service;

import com.estateiq.auth.dto.UpdateUserRequest;
import com.estateiq.auth.dto.UserResponse;
import com.estateiq.auth.entity.User;
import com.estateiq.auth.entity.UserStatus;
import com.estateiq.auth.mapper.UserMapper;
import com.estateiq.auth.repository.UserRepository;
import com.estateiq.common.security.CurrentUserProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final CurrentUserProvider currentUserProvider;

    @Override
    @Transactional
    public UserResponse getCurrentUser() {
        String sub = currentUserProvider.getRequiredUserSubject();
        User user = getOrCreateUser(sub);
        return userMapper.toResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateCurrentUser(UpdateUserRequest request) {
        String sub = currentUserProvider.getRequiredUserSubject();
        User user = getOrCreateUser(sub);
        userMapper.updateUserFromRequest(request, user);
        User saved = userRepository.save(user);
        log.info("Updated profile for user: {}", sub);
        return userMapper.toResponse(saved);
    }

    private User getOrCreateUser(String keycloakSubject) {
        return userRepository.findByKeycloakSubject(keycloakSubject)
                .orElseGet(() -> {
                    log.info("First authenticated access for subject {}. Provisioning new local user profile.", keycloakSubject);
                    User newUser = User.builder()
                            .id(UUID.randomUUID())
                            .keycloakSubject(keycloakSubject)
                            .email(currentUserProvider.getCurrentUserEmail().orElse(null))
                            .firstName(currentUserProvider.getCurrentUserFirstName().orElse(null))
                            .lastName(currentUserProvider.getCurrentUserLastName().orElse(null))
                            .status(UserStatus.ACTIVE)
                            .build();
                    return userRepository.save(newUser);
                });
    }
}
