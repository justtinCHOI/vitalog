package com.justin.gpttestbackend.domain.chat.domain;

import com.justin.gpttestbackend.domain.common.model.BaseTimeEntity;
import com.justin.gpttestbackend.domain.project.domain.Project;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "chat")
public class Chat extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String message;

    private String date;

    @Builder
    public Chat(Long id, Project project, String name, String message, String date) {
        this.id = id;
        this.project = project;
        this.name = name;
        this.message = message;
        this.date = date;
    }
}