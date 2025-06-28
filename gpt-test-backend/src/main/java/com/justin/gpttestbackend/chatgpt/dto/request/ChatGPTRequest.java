package com.justin.gpttestbackend.chatgpt.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.Map;

public record ChatGPTRequest(
        String model,
        List<Message> messages,
        @JsonProperty("response_format") ResponseFormat responseFormat,
        @JsonProperty("max_tokens") int maxTokens) {

    public record Message(String role, String content) {}

    public record ResponseFormat(String type, @JsonProperty("json_schema") JsonSchema jsonSchema) {}

    public record JsonSchema(String name, Schema schema) {}

    public record Schema(
            String type,
            Map<String, Object> properties,
            String[] required,
            boolean additionalProperties) {}

    public record Items(String type, String description) {}
} 