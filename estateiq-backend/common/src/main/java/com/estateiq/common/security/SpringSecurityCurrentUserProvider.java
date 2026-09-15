package com.estateiq.common.security;

import com.estateiq.common.exception.UnauthorizedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class SpringSecurityCurrentUserProvider implements CurrentUserProvider {

    private static final String ROLE_PREFIX = "ROLE_";
    private static final String ADMIN_ROLE = "ADMIN";

    private Optional<Authentication> getAuthentication() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return Optional.empty();
        }
        return Optional.of(auth);
    }

    private Optional<Jwt> getJwt() {
        return getAuthentication()
                .map(Authentication::getPrincipal)
                .filter(Jwt.class::isInstance)
                .map(Jwt.class::cast);
    }

    @Override
    public Optional<String> getCurrentUserSubject() {
        return getJwt().map(Jwt::getSubject);
    }

    @Override
    public Optional<String> getCurrentUserEmail() {
        return getJwt().map(jwt -> {
            String email = jwt.getClaimAsString("email");
            return email != null ? email : jwt.getClaimAsString("preferred_username");
        });
    }

    @Override
    public Optional<String> getCurrentUserFirstName() {
        return getJwt().map(jwt -> jwt.getClaimAsString("given_name"));
    }

    @Override
    public Optional<String> getCurrentUserLastName() {
        return getJwt().map(jwt -> jwt.getClaimAsString("family_name"));
    }

    @Override
    public Set<String> getCurrentUserRoles() {
        return getAuthentication()
                .map(auth -> auth.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .map(role -> role.startsWith(ROLE_PREFIX) ? role.substring(ROLE_PREFIX.length()) : role)
                        .collect(Collectors.toSet()))
                .orElse(Collections.emptySet());
    }

    @Override
    public boolean hasRole(String role) {
        if (role == null) return false;
        String normalizedRole = role.startsWith(ROLE_PREFIX) ? role.substring(ROLE_PREFIX.length()) : role;
        return getCurrentUserRoles().contains(normalizedRole);
    }

    @Override
    public boolean isAdmin() {
        return hasRole(ADMIN_ROLE);
    }

    @Override
    public String getRequiredUserSubject() {
        return getCurrentUserSubject()
                .orElseThrow(() -> new UnauthorizedException("Authenticated user context is required."));
    }
}
