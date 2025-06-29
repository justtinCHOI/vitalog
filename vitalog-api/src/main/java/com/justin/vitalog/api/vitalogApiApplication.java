package com.justin.vitalog.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class vitalogApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(vitalogApiApplication.class, args);
    }

}
