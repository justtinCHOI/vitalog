package com.justin.vitalog.api.domain.project.dto;

import com.justin.vitalog.api.domain.project.domain.Project;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
public class ProjectResponse {
    private final Long id;
    private final String name;
    private final LocalDateTime createdAt;

    @Builder
    public ProjectResponse(Long id, String name, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
    }

    public static ProjectResponse from(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .createdAt(project.getCreatedAt())
                .build();
    }
} 