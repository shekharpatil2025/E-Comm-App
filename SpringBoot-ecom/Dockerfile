# ── Stage 1: Build ────────────────────────────────────────────────────
# Use Maven + Java 21 to build the jar
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

# Copy pom.xml first — Docker caches this layer
# so dependencies aren't re-downloaded on every build
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# ── Stage 2: Run ──────────────────────────────────────────────────────
# Use lightweight JRE (not full JDK) to run the jar
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy only the built jar from Stage 1
COPY --from=build /app/target/*.jar app.jar

# Expose Spring Boot port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
