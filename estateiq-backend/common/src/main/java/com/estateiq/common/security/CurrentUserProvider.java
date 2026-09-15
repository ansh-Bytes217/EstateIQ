package com.estateiq.common.security;

import java.util.Optional;
import java.util.Set;

public interface CurrentUserProvider {
    Optional<String> getCurrentUserSubject();
    Optional<String> getCurrentUserEmail();
    Optional<String> getCurrentUserFirstName();
    Optional<String> getCurrentUserLastName();
    Set<String> getCurrentUserRoles();
    boolean hasRole(String role);
    boolean isAdmin();
    String getRequiredUserSubject();
}
