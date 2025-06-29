package com.justin.vitalog.api.domain.project.repository;

import com.justin.vitalog.api.domain.project.domain.Project;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByMemberId(Long memberId);
} 