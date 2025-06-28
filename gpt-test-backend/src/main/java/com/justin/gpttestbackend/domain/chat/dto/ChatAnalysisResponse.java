package com.justin.gpttestbackend.domain.chat.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatAnalysisResponse {
    private String summary;
    private List<String> keyTopics;
    private List<SentimentAnalysis> sentimentAnalysis;

    public record SentimentAnalysis(
            String speaker,
            String sentiment
    ) {}
} 