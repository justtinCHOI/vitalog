package com.justin.gpttestbackend.domain.summary.dto;

import com.justin.gpttestbackend.domain.summary.domain.Summary;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class SummaryResponse {
    private final Long id;
    private final String content;
    private final LocalDateTime createdAt;

    @Builder
    public SummaryResponse(Long id, String content, LocalDateTime createdAt) {
        this.id = id;
        this.content = content;
        this.createdAt = createdAt;
    }

    public static SummaryResponse from(Summary summary) {
        return SummaryResponse.builder()
                .id(summary.getId())
                .content(summary.getContent())
                .createdAt(summary.getCreatedAt())
                .build();
    }
} 