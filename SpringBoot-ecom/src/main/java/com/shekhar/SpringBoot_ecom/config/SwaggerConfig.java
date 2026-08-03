package com.shekhar.SpringBoot_ecom.config;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("E-Commerce REST API")
                        .description("""
                                Full-stack e-commerce backend built with Spring Boot.
                                
                                **Authentication:** Register or login to get a JWT token.
                                Click 'Authorize' and enter: `Bearer <your_token>`
                                
                                **Roles:**
                                - `USER` — browse products, manage cart, place orders
                                - `ADMIN` — create, update, delete products
                                """)
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Shekhar Patil")
                                .email("shekharpatil2025@gmail.com")
                                .url("https://github.com/shekharpatil2025")))
                // This adds the Authorize button to Swagger UI
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new Components()
                        .addSecuritySchemes("Bearer Authentication",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Enter your JWT token (without 'Bearer' prefix)")));
    }
}