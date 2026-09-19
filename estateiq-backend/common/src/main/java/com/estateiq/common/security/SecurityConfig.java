package com.estateiq.common.security;

import com.estateiq.common.dto.ErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;

import java.time.Instant;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final KeycloakJwtAuthenticationConverter keycloakJwtAuthenticationConverter;
    private final ObjectMapper objectMapper;

    public SecurityConfig(KeycloakJwtAuthenticationConverter keycloakJwtAuthenticationConverter) {
        this.keycloakJwtAuthenticationConverter = keycloakJwtAuthenticationConverter;
        this.objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/actuator/health",
                    "/api/v1/public/**",
                    "/api/v1/properties/search",
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html"
                ).permitAll()
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(keycloakJwtAuthenticationConverter))
                .authenticationEntryPoint(authenticationEntryPoint())
                .accessDeniedHandler(accessDeniedHandler())
            )
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint(authenticationEntryPoint())
                .accessDeniedHandler(accessDeniedHandler())
            );

        return http.build();
    }

    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {
        return (request, response, authException) -> {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            String traceId = request.getHeader("X-Correlation-ID");

            ErrorResponse error = ErrorResponse.builder()
                    .timestamp(Instant.now())
                    .status(HttpStatus.UNAUTHORIZED.value())
                    .error("UNAUTHORIZED")
                    .message(authException.getMessage() != null ? authException.getMessage() : "Full authentication is required to access this resource")
                    .path(request.getRequestURI())
                    .traceId(traceId != null ? traceId : "unknown")
                    .build();

            response.getWriter().write(objectMapper.writeValueAsString(error));
        };
    }

    @Bean
    public AccessDeniedHandler accessDeniedHandler() {
        return (request, response, accessDeniedException) -> {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            String traceId = request.getHeader("X-Correlation-ID");

            ErrorResponse error = ErrorResponse.builder()
                    .timestamp(Instant.now())
                    .status(HttpStatus.FORBIDDEN.value())
                    .error("FORBIDDEN")
                    .message(accessDeniedException.getMessage() != null ? accessDeniedException.getMessage() : "Access is denied")
                    .path(request.getRequestURI())
                    .traceId(traceId != null ? traceId : "unknown")
                    .build();

            response.getWriter().write(objectMapper.writeValueAsString(error));
        };
    }
}
