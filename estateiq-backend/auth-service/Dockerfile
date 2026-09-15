FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Copy pom.xml files for dependency resolution
COPY pom.xml .
COPY common/pom.xml common/
COPY gateway-service/pom.xml gateway-service/
COPY auth-service/pom.xml auth-service/
COPY property-service/pom.xml property-service/
COPY search-service/pom.xml search-service/

# Copy the source code
COPY . .

# Build the required modules
RUN mvn clean package -pl common,auth-service -am -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -S estateiq && adduser -S estateiq -G estateiq
USER estateiq

COPY --from=builder /app/auth-service/target/*.jar app.jar
EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]
