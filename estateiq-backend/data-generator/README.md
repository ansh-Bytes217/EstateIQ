# EstateIQ Synthetic Data Generator

Standalone Java 21 CLI for generating deterministic, synthetic property and listing data for development, integration testing, search testing, map testing, and PostgreSQL benchmarking. It does not scrape Zillow or any other external website.

## Build

From `estateiq-backend`:

```bash
mvn -pl data-generator -am package
```

The executable jar is created at `data-generator/target/data-generator-1.0.0-SNAPSHOT.jar`.

## Usage

The safe default generates 1,000 properties and no listings:

```bash
java -jar data-generator/target/data-generator-1.0.0-SNAPSHOT.jar
```

Examples:

```bash
java -jar data-generator/target/data-generator-1.0.0-SNAPSHOT.jar --properties=10000 --batch-size=1000 --seed=42 --generate-listings=true
java -jar data-generator/target/data-generator-1.0.0-SNAPSHOT.jar --properties=100000 --batch-size=5000 --seed=42 --generate-listings=true
java -jar data-generator/target/data-generator-1.0.0-SNAPSHOT.jar --properties=1000000 --batch-size=10000 --seed=42 --generate-listings=true
```

Supported arguments are `properties`, `batch-size`, `seed`, `database-url`, `database-username`, `database-password`, `generate-listings`, `listing-density`, and `owner-pool-size`. Database values also use `DATABASE_URL`, `DATABASE_USERNAME`, and `DATABASE_PASSWORD`; generator values use the matching `GENERATOR_*` environment variables. Command-line arguments take precedence.

The database must already contain the property schema created by Flyway, normally by starting the property service or running the backend migrations. The writer uses prepared JDBC batches and commits each batch independently. It does not call REST endpoints, hold the complete dataset in memory, drop tables, truncate data, or delete existing rows.

## Determinism and reruns

Property and listing UUIDs are derived from the configured seed, record index, and namespace, while generated values also use the seed. Running the same configuration produces the same logical records. Inserts use `ON CONFLICT` upserts, so rerunning the same configuration updates those generated records instead of duplicating them. A different seed creates a separate deterministic dataset.

Generated records are identifiable by `owner_subject` values such as `synthetic-owner-000001` and titles beginning with `Synthetic`. The generator uses the existing property and listing table columns and enum values. Listings are generated as valid `ACTIVE` or `DRAFT` initial records.

## Safety and cleanup

Use this tool only with development, testing, benchmarking, or demo databases. It never performs destructive cleanup automatically. To clear generated data, explicitly review and run a targeted SQL operation in the intended database, for example:

```sql
DELETE FROM property.listings WHERE property_id IN (
  SELECT id FROM property.properties WHERE owner_subject LIKE 'synthetic-owner-%'
);
DELETE FROM property.properties WHERE owner_subject LIKE 'synthetic-owner-%';
```

Review the target database and backup policy before executing cleanup. A 1M run is I/O and index heavy; start with 10K, increase the batch size based on observed memory and database throughput, and benchmark 100K before attempting 1M. This repository does not claim a 1M runtime until it is measured against the target PostgreSQL environment.
