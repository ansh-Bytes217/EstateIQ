CREATE TABLE properties (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    property_type VARCHAR(50),
    listing_type VARCHAR(50),
    status VARCHAR(50),
    price DECIMAL(19, 2),
    currency VARCHAR(10),
    bedrooms INT,
    bathrooms INT,
    area_sqft DECIMAL(10, 2),
    city VARCHAR(100),
    locality VARCHAR(100),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_property_type ON properties(property_type);
CREATE INDEX idx_properties_listing_type ON properties(listing_type);
CREATE INDEX idx_properties_status ON properties(status);
