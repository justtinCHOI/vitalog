package com.justin.gpttestbackend.domain.summary.domain;

import com.justin.gpttestbackend.domain.common.model.BaseTimeEntity;
import com.justin.gpttestbackend.domain.project.domain.Project;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "summary")
public class Summary extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Builder
    public Summary(Project project, String content) {
        this.project = project;
        this.content = content;
    }
} 