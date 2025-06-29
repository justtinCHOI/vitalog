package com.justin.vitalog.api.global.config.feign;

import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@EnableFeignClients(basePackages = "com.justin.vitalog")
@Import(FeignErrorDecoder.class)
public class FeignConfig {
    //    @Bean
    //    public RequestInterceptor loggingRequestInterceptor() {
    //        return new LoggingRequestInterceptor();
    //    }
} 