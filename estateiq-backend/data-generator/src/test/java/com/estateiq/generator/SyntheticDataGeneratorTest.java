package com.estateiq.generator;

import org.junit.jupiter.api.Test;

import java.util.HashSet;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class SyntheticDataGeneratorTest {
    @Test
    void sameSeedProducesSamePropertiesAndListings() {
        GeneratorConfig config = new GeneratorConfig(100, 25, 42L, "url", "user", "password", true, 1.0, 10);
        GeneratedBatch first = new SyntheticDataGenerator(config).generateBatch(0, 100);
        GeneratedBatch second = new SyntheticDataGenerator(config).generateBatch(0, 100);

        assertThat(second).isEqualTo(first);
    }

    @Test
    void generatedRecordsAreValidAndListingsReferenceTheirBatchProperties() {
        GeneratorConfig config = new GeneratorConfig(200, 50, 42L, "url", "user", "password", true, 1.0, 10);
        GeneratedBatch batch = new SyntheticDataGenerator(config).generateBatch(0, 200);

        new GeneratedDataValidator().validate(batch);
        Set<java.util.UUID> propertyIds = batch.properties().stream().map(PropertyRecord::id).collect(java.util.stream.Collectors.toSet());
        assertThat(batch.properties()).hasSize(200);
        assertThat(batch.listings()).isNotEmpty();
        assertThat(batch.listings()).allSatisfy(listing -> assertThat(propertyIds).contains(listing.propertyId()));
        assertThat(batch.properties()).allSatisfy(property -> assertThat(property.latitude().doubleValue()).isBetween(-90.0, 90.0));
        assertThat(new HashSet<>(batch.properties().stream().map(PropertyRecord::id).toList())).hasSize(200);
    }

    @Test
    void configurationParsesCommandLineValues() {
        GeneratorConfig config = GeneratorConfig.fromArgs(new String[]{
                "--properties=100000", "--batch-size=5000", "--seed=7",
                "--database-url=jdbc:test", "--database-username=test", "--database-password=secret",
                "--generate-listings=true", "--listing-density=0.5", "--owner-pool-size=25"});

        assertThat(config.properties()).isEqualTo(100000);
        assertThat(config.batchSize()).isEqualTo(5000);
        assertThat(config.seed()).isEqualTo(7);
        assertThat(config.generateListings()).isTrue();
        assertThat(config.listingDensity()).isEqualTo(0.5);
        assertThat(config.ownerPoolSize()).isEqualTo(25);
    }
}
