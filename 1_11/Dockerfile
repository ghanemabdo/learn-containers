FROM amazoncorretto

WORKDIR /usr/src/app
EXPOSE 8080

COPY ./mvnw .
COPY ./pom.xml .
COPY ./src ./src
COPY .mvn .mvn

RUN ./mvnw package

CMD ["java", "-jar", "./target/docker-example-1.1.3.jar"]
