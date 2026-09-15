package com.estateiq.auth.service;

import com.estateiq.auth.dto.UpdateUserRequest;
import com.estateiq.auth.dto.UserResponse;

public interface UserService {
    UserResponse getCurrentUser();
    UserResponse updateCurrentUser(UpdateUserRequest request);
}
