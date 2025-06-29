package com.justin.vitalog.api.domain.project.domain;

import com.justin.vitalog.api.domain.common.model.BaseTimeEntity;
import com.justin.vitalog.api.domain.member.domain.Member;
import com.justin.vitalog.api.domain.summary.domain.Summary;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "project")
public class Project extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "project_id")
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Summary> summaries = new ArrayList<>();

    @Builder
    public Project(Long id, String name, Member member) {
        this.id = id;
        this.name = name;
        this.member = member;
    }
} 