CREATE TABLE users (
    id UUID PRIMARY KEY,
    keycloak_subject VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE UNIQUE INDEX idx_users_keycloak_subject ON users(keycloak_subject);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
