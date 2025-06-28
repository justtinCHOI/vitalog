package com.justin.gpttestbackend.chatgpt;

import feign.RequestInterceptor;
import feign.codec.Decoder;
import feign.jackson.JacksonDecoder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;

public class FeignChatGPTConfig {
    @Value("${openai.api.key}")
    private String GPT_API_KEY;

    @Bean
    public RequestInterceptor requestInterceptor() {
        return requestTemplate -> {
            requestTemplate.header("Authorization", "Bearer " + GPT_API_KEY);
        };
    }

    @Bean
    public Decoder defaultJsonDecoder() {
        return new JacksonDecoder();
    }
} 