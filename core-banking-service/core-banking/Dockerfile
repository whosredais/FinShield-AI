# Étape 1 : Construction (Build) avec Maven
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# On compile le projet et on crée le JAR (skip tests pour aller vite)
RUN mvn clean package -DskipTests

# Étape 2 : Exécution (Run) avec une image Java légère
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# On récupère le JAR construit à l'étape précédente
COPY --from=build /app/target/*.jar app.jar

# On ouvre le port 8081
EXPOSE 8081

# On lance l'app
ENTRYPOINT ["java", "-jar", "app.jar"]