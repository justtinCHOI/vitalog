package com.justin.vitalog.api.chatgpt.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record ChatGPTResponse(
        List<Choice> choices, // 응답 목록
        Usage usage // 토큰 사용량 정보
        ) {
    public record Choice(int index, Message message) {}

    public record Message(String role, String content) {}

    public record Usage(
            @JsonProperty("prompt_tokens") int promptTokens,
            @JsonProperty("completion_tokens") int completionTokens,
            @JsonProperty("total_tokens") int totalTokens) {}
} 