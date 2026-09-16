package com.estateiq.generator;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public final class JdbcBatchWriter implements AutoCloseable {
    private static final String PROPERTY_SQL = """
            INSERT INTO property.properties
            (id, owner_subject, title, description, property_type, status, bedrooms, bathrooms, area_sqft,
             city, locality, year_built, floor, parking, furnished, latitude, longitude, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT (id) DO UPDATE SET owner_subject = EXCLUDED.owner_subject, title = EXCLUDED.title,
              description = EXCLUDED.description, property_type = EXCLUDED.property_type, status = EXCLUDED.status,
              bedrooms = EXCLUDED.bedrooms, bathrooms = EXCLUDED.bathrooms, area_sqft = EXCLUDED.area_sqft,
              city = EXCLUDED.city, locality = EXCLUDED.locality, year_built = EXCLUDED.year_built, floor = EXCLUDED.floor,
              parking = EXCLUDED.parking, furnished = EXCLUDED.furnished, latitude = EXCLUDED.latitude,
              longitude = EXCLUDED.longitude, updated_at = EXCLUDED.updated_at
            """;
    private static final String LISTING_SQL = """
            INSERT INTO property.listings
            (id, property_id, listing_type, status, price, currency, listed_at, expires_at, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT (id) DO UPDATE SET property_id = EXCLUDED.property_id, listing_type = EXCLUDED.listing_type,
              status = EXCLUDED.status, price = EXCLUDED.price, currency = EXCLUDED.currency,
              listed_at = EXCLUDED.listed_at, expires_at = EXCLUDED.expires_at, updated_at = EXCLUDED.updated_at
            """;

    private final Connection connection;

    public JdbcBatchWriter(GeneratorConfig config) throws SQLException {
        connection = DriverManager.getConnection(config.databaseUrl(), config.databaseUsername(), config.databasePassword());
        connection.setAutoCommit(false);
    }

    public void write(GeneratedBatch batch) throws SQLException {
        try (PreparedStatement properties = connection.prepareStatement(PROPERTY_SQL);
             PreparedStatement listings = connection.prepareStatement(LISTING_SQL)) {
            for (PropertyRecord property : batch.properties()) {
                properties.setObject(1, property.id());
                properties.setString(2, property.ownerSubject());
                properties.setString(3, property.title());
                properties.setString(4, property.description());
                properties.setString(5, property.propertyType());
                properties.setString(6, property.status());
                properties.setInt(7, property.bedrooms());
                properties.setInt(8, property.bathrooms());
                properties.setBigDecimal(9, property.areaSqft());
                properties.setString(10, property.city());
                properties.setString(11, property.locality());
                properties.setInt(12, property.yearBuilt());
                properties.setInt(13, property.floor());
                properties.setBoolean(14, property.parking());
                properties.setBoolean(15, property.furnished());
                properties.setBigDecimal(16, property.latitude());
                properties.setBigDecimal(17, property.longitude());
                properties.setObject(18, property.createdAt());
                properties.setObject(19, property.updatedAt());
                properties.addBatch();
            }
            properties.executeBatch();

            for (ListingRecord listing : batch.listings()) {
                listings.setObject(1, listing.id());
                listings.setObject(2, listing.propertyId());
                listings.setString(3, listing.listingType());
                listings.setString(4, listing.status());
                listings.setBigDecimal(5, listing.price());
                listings.setString(6, listing.currency());
                listings.setObject(7, listing.listedAt());
                listings.setObject(8, listing.expiresAt());
                listings.setObject(9, listing.createdAt());
                listings.setObject(10, listing.updatedAt());
                listings.addBatch();
            }
            listings.executeBatch();
            connection.commit();
        } catch (SQLException | RuntimeException exception) {
            connection.rollback();
            throw exception;
        }
    }

    @Override
    public void close() throws SQLException {
        connection.close();
    }
}
