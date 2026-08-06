package com.shekhar.SpringBoot_ecom;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class SpringBootEcomApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringBootEcomApplication.class, args);
	}

}
