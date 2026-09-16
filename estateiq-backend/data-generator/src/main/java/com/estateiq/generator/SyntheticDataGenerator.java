package com.estateiq.generator;

import com.estateiq.generator.domain.PropertyCatalog;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.SplittableRandom;
import java.util.UUID;

public final class SyntheticDataGenerator {
    private static final Instant BASE_TIME = Instant.parse("2024-01-01T00:00:00Z");
    private static final List<CityProfile> CITIES = PropertyCatalog.profiles();
    private static final String[] TYPES = {"APARTMENT", "VILLA", "INDEPENDENT_HOUSE", "TOWNHOUSE", "PENTHOUSE", "STUDIO", "PLOT", "COMMERCIAL"};

    private final GeneratorConfig config;

    public SyntheticDataGenerator(GeneratorConfig config) {
        this.config = config;
    }

    public GeneratedBatch generateBatch(int startIndex, int size) {
        List<PropertyRecord> properties = new ArrayList<>(size);
        List<ListingRecord> listings = new ArrayList<>();
        for (int index = startIndex; index < startIndex + size; index++) {
            SplittableRandom random = new SplittableRandom(config.seed() + 0x9E3779B97F4A7C15L * (index + 1L));
            PropertyRecord property = generateProperty(index, random);
            properties.add(property);
            if (config.generateListings() && random.nextDouble() < config.listingDensity()) {
                listings.add(generateListing(property, random));
            }
        }
        return new GeneratedBatch(properties, listings);
    }

    private PropertyRecord generateProperty(int index, SplittableRandom random) {
        CityProfile city = CITIES.get(random.nextInt(CITIES.size()));
        LocalityProfile locality = city.localities().get(random.nextInt(city.localities().size()));
        String type = propertyType(random);
        int bedrooms = bedrooms(type, random);
        int bathrooms = bathrooms(type, bedrooms, random);
        BigDecimal area = area(type, bedrooms, random);
        int floor = floor(type, random);
        boolean furnished = random.nextDouble() < (type.equals("PLOT") ? 0.02 : type.equals("PENTHOUSE") ? 0.78 : 0.48);
        boolean parking = type.equals("PLOT") || random.nextDouble() < Math.min(0.96, 0.35 + area.doubleValue() / 3000.0);
        int yearBuilt = 1990 + random.nextInt(35);
        BigDecimal latitude = decimal(locality.latitude() + (random.nextDouble() - 0.5) * 0.018, 7);
        BigDecimal longitude = decimal(locality.longitude() + (random.nextDouble() - 0.5) * 0.018, 7);
        Instant createdAt = BASE_TIME.plus(index % 900, ChronoUnit.DAYS).plus(index % 86400, ChronoUnit.SECONDS);
        UUID id = deterministicUuid("property", config.seed() + ":" + index);
        String title = title(type, bedrooms, locality.locality());
        String description = description(type, bedrooms, area, locality.locality());
        return new PropertyRecord(id, owner(index), title, description, type, "ACTIVE", bedrooms, bathrooms, area,
                city.city(), locality.locality(), yearBuilt, floor, parking, furnished, latitude, longitude, createdAt, createdAt);
    }

    private ListingRecord generateListing(PropertyRecord property, SplittableRandom random) {
        String listingType = random.nextDouble() < 0.22 ? "RENT" : random.nextDouble() < 0.08 ? "NEW_CONSTRUCTION" : "SALE";
        double typeMultiplier = switch (property.propertyType()) {
            case "PENTHOUSE" -> 1.35;
            case "VILLA" -> 1.18;
            case "COMMERCIAL" -> 1.10;
            case "PLOT" -> 0.90;
            default -> 1.0;
        };
        double furnishingMultiplier = property.furnished() ? 1.08 : 1.0;
        double floorMultiplier = property.floor() > 10 ? 1.04 : property.floor() > 0 ? 1.01 : 0.98;
        double variation = 0.92 + random.nextDouble() * 0.16;
        double salePrice = property.areaSqft().doubleValue() * localityRate(property.city(), property.locality())
                * typeMultiplier * furnishingMultiplier * floorMultiplier * variation;
        BigDecimal price = money(listingType.equals("RENT") ? salePrice * 0.0045 : salePrice);
        Instant listedAt = property.createdAt().plus(random.nextInt(30), ChronoUnit.DAYS);
        Instant expiresAt = listedAt.plus(listingType.equals("RENT") ? 180 : 365, ChronoUnit.DAYS);
        String status = random.nextDouble() < 0.90 ? "ACTIVE" : "DRAFT";
        return new ListingRecord(deterministicUuid("listing", config.seed() + ":" + property.id()), property.id(), listingType, status,
                price, "INR", listedAt, expiresAt, listedAt, listedAt);
    }

    private double localityRate(String city, String locality) {
        return CITIES.stream().filter(profile -> profile.city().equals(city)).flatMap(profile -> profile.localities().stream())
                .filter(profile -> profile.locality().equals(locality)).findFirst().orElseThrow().basePricePerSqft();
    }

    private String propertyType(SplittableRandom random) {
        double value = random.nextDouble();
        if (value < 0.45) return "APARTMENT";
        if (value < 0.65) return "VILLA";
        if (value < 0.80) return "INDEPENDENT_HOUSE";
        if (value < 0.88) return "PLOT";
        if (value < 0.93) return "PENTHOUSE";
        if (value < 0.97) return "TOWNHOUSE";
        if (value < 0.99) return "STUDIO";
        return "COMMERCIAL";
    }

    private int bedrooms(String type, SplittableRandom random) {
        if (type.equals("PLOT") || type.equals("COMMERCIAL")) return 0;
        if (type.equals("STUDIO")) return 1;
        double value = random.nextDouble();
        return value < 0.12 ? 1 : value < 0.57 ? 2 : value < 0.88 ? 3 : value < 0.98 ? 4 : 5;
    }

    private int bathrooms(String type, int bedrooms, SplittableRandom random) {
        if (type.equals("PLOT")) return 0;
        if (type.equals("COMMERCIAL")) return 1 + random.nextInt(4);
        return Math.max(1, Math.min(5, bedrooms == 0 ? 1 : bedrooms - 1 + (random.nextDouble() < 0.65 ? 1 : 0)));
    }

    private BigDecimal area(String type, int bedrooms, SplittableRandom random) {
        if (type.equals("PLOT")) return money(800 + random.nextDouble() * 3200);
        if (type.equals("COMMERCIAL")) return money(500 + random.nextDouble() * 4500);
        double base = type.equals("STUDIO") ? 550 : 520 + bedrooms * 430;
        double variation = 0.82 + random.nextDouble() * 0.36;
        return money(base * variation);
    }

    private int floor(String type, SplittableRandom random) {
        if (type.equals("PLOT")) return 0;
        if (type.equals("VILLA") || type.equals("INDEPENDENT_HOUSE")) return random.nextInt(3);
        return 1 + random.nextInt(type.equals("PENTHOUSE") ? 20 : 15);
    }

    private String title(String type, int bedrooms, String locality) {
        String size = bedrooms == 0 ? "Commercial" : bedrooms == 1 ? "1 BHK" : bedrooms + " BHK";
        return "Synthetic " + size + " " + type.replace('_', ' ') + " in " + locality;
    }

    private String description(String type, int bedrooms, BigDecimal area, String locality) {
        return "Synthetic EstateIQ listing for a " + bedrooms + " bedroom " + type.toLowerCase().replace('_', ' ')
                + " covering " + area.setScale(0, RoundingMode.HALF_UP) + " sqft in " + locality + ".";
    }

    private String owner(int index) {
        return "synthetic-owner-%06d".formatted(index % config.ownerPoolSize() + 1);
    }

    private static UUID deterministicUuid(String namespace, Object value) {
        return UUID.nameUUIDFromBytes((namespace + ":" + value).getBytes(StandardCharsets.UTF_8));
    }

    private static BigDecimal decimal(double value, int scale) {
        return BigDecimal.valueOf(value).setScale(scale, RoundingMode.HALF_UP);
    }

    private static BigDecimal money(double value) {
        return decimal(value, 2);
    }

    public static boolean isKnownPropertyType(String value) {
        for (String type : TYPES) if (type.equals(value)) return true;
        return false;
    }
}
