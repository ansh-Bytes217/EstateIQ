package com.estateiq.generator;

import java.util.HashMap;
import java.util.Map;

public record GeneratorConfig(
        int properties,
        int batchSize,
        long seed,
        String databaseUrl,
        String databaseUsername,
        String databasePassword,
        boolean generateListings,
        double listingDensity,
        int ownerPoolSize) {

    public static GeneratorConfig fromArgs(String[] args) {
        Map<String, String> values = new HashMap<>();
        for (String arg : args) {
            if (!arg.startsWith("--") || !arg.contains("=")) {
                throw new IllegalArgumentException("Arguments must use --name=value: " + arg);
            }
            int separator = arg.indexOf('=');
            values.put(arg.substring(2, separator), arg.substring(separator + 1));
        }
        int properties = integer(values, "properties", "GENERATOR_PROPERTIES", 1_000);
        int batchSize = integer(values, "batch-size", "GENERATOR_BATCH_SIZE", 1_000);
        long seed = longValue(values, "seed", "GENERATOR_SEED", 42L);
        boolean listings = booleanValue(values, "generate-listings", "GENERATOR_GENERATE_LISTINGS", false);
        double density = doubleValue(values, "listing-density", "GENERATOR_LISTING_DENSITY", 0.70d);
        int ownerPool = integer(values, "owner-pool-size", "GENERATOR_OWNER_POOL_SIZE", 10_000);
        String url = text(values, "database-url", "DATABASE_URL", "jdbc:postgresql://localhost:5432/estateiq_db");
        String username = text(values, "database-username", "DATABASE_USERNAME", "estateiq");
        String password = text(values, "database-password", "DATABASE_PASSWORD", "estateiq_password");

        if (properties < 1 || batchSize < 1 || ownerPool < 1) {
            throw new IllegalArgumentException("properties, batch-size, and owner-pool-size must be positive");
        }
        if (density < 0 || density > 1) {
            throw new IllegalArgumentException("listing-density must be between 0 and 1");
        }
        return new GeneratorConfig(properties, batchSize, seed, url, username, password, listings, density, ownerPool);
    }

    private static String text(Map<String, String> args, String key, String environment, String fallback) {
        return args.getOrDefault(key, System.getenv().getOrDefault(environment, fallback));
    }

    private static int integer(Map<String, String> args, String key, String environment, int fallback) {
        return Integer.parseInt(text(args, key, environment, String.valueOf(fallback)));
    }

    private static long longValue(Map<String, String> args, String key, String environment, long fallback) {
        return Long.parseLong(text(args, key, environment, String.valueOf(fallback)));
    }

    private static double doubleValue(Map<String, String> args, String key, String environment, double fallback) {
        return Double.parseDouble(text(args, key, environment, String.valueOf(fallback)));
    }

    private static boolean booleanValue(Map<String, String> args, String key, String environment, boolean fallback) {
        return Boolean.parseBoolean(text(args, key, environment, String.valueOf(fallback)));
    }
}
