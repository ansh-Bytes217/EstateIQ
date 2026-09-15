CREATE TABLE listings (
    id UUID PRIMARY KEY,
    property_id UUID NOT NULL,
    listing_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    price DECIMAL(19, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    listed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_listings_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    CONSTRAINT chk_listings_price_positive CHECK (price > 0)
);

CREATE INDEX idx_listings_property_id ON listings(property_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_listing_type ON listings(listing_type);
