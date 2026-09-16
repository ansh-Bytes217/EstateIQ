package com.estateiq.generator;

import java.time.Duration;
import java.time.Instant;
import java.util.Locale;

public final class DataGeneratorApplication {
    private DataGeneratorApplication() {
    }

    public static void main(String[] args) throws Exception {
        GeneratorConfig config = GeneratorConfig.fromArgs(args);
        SyntheticDataGenerator generator = new SyntheticDataGenerator(config);
        GeneratedDataValidator validator = new GeneratedDataValidator();
        Instant started = Instant.now();

        System.out.println("EstateIQ Synthetic Data Generator");
        System.out.println("---------------------------------");
        System.out.printf("Target properties : %,d%n", config.properties());
        System.out.printf("Batch size        : %,d%n", config.batchSize());
        System.out.printf("Seed              : %d%n", config.seed());
        System.out.printf("Generate listings : %s%n%n", config.generateListings());

        try (JdbcBatchWriter writer = new JdbcBatchWriter(config)) {
            for (int start = 0; start < config.properties(); start += config.batchSize()) {
                int size = Math.min(config.batchSize(), config.properties() - start);
                GeneratedBatch batch = generator.generateBatch(start, size);
                validator.validate(batch);
                writer.write(batch);
                int completed = start + size;
                printProgress(completed, config.properties(), started, batch.listings().size());
            }
        }
        Duration elapsed = Duration.between(started, Instant.now());
        System.out.printf("%nCompleted %,d properties in %ds.%n", config.properties(), elapsed.toSeconds());
    }

    private static void printProgress(int completed, int total, Instant started, int listingCount) {
        double fraction = completed / (double) total;
        int width = 30;
        int filled = (int) (fraction * width);
        String bar = "=".repeat(filled) + "-".repeat(width - filled);
        long elapsedMillis = Math.max(1, Duration.between(started, Instant.now()).toMillis());
        double rate = completed * 1000.0 / elapsedMillis;
        long remaining = Math.max(0, (long) ((total - completed) / Math.max(rate, 0.001)));
        System.out.printf(Locale.ROOT, "[%s] %3d%%  Properties: %,d / %,d  Rate: %,.0f records/sec  ETA: %ds  Batch listings: %d%n",
                bar, Math.round(fraction * 100), completed, total, rate, remaining, listingCount);
    }
}
