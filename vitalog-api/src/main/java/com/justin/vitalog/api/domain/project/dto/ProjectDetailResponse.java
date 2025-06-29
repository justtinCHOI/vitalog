package com.justin.vitalog.api.domain.project.dto;

import com.justin.vitalog.api.domain.chat.dto.ChatResponse;
import com.justin.vitalog.api.domain.project.domain.Project;
import com.justin.vitalog.api.domain.summary.dto.SummaryResponse;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.Builder;
import lombok.Getter;

@Getter
public class ProjectDetailResponse {
    private final Long id;
    private final String name;
    private final LocalDateTime createdAt;
    private final List<ChatResponse> chats;
    private final List<SummaryResponse> summaries;

    @Builder
    public ProjectDetailResponse(Long id, String name, LocalDateTime createdAt, List<ChatResponse> chats, List<SummaryResponse> summaries) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
        this.chats = chats;
        this.summaries = summaries;
    }

    public static ProjectDetailResponse from(Project project, List<ChatResponse> chats) {
        return ProjectDetailResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .createdAt(project.getCreatedAt())
                .chats(chats)
                .summaries(project.getSummaries().stream().map(SummaryResponse::from).collect(Collectors.toList()))
                .build();
    }
} 