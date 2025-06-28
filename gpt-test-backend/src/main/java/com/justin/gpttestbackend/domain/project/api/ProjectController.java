package com.justin.gpttestbackend.domain.project.api;

import com.justin.gpttestbackend.domain.project.application.ProjectService;
import com.justin.gpttestbackend.domain.project.dto.ProjectCreateRequest;
import com.justin.gpttestbackend.domain.project.dto.ProjectDetailResponse;
import com.justin.gpttestbackend.domain.project.dto.ProjectResponse;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectDetailResponse> getProjectDetails(@PathVariable Long projectId) {
        return ResponseEntity.ok(projectService.getProjectDetails(projectId));
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getMyProjects() {
        return ResponseEntity.ok(projectService.getMyProjects());
    }

    @PostMapping
    public ResponseEntity<Void> createProject(@Valid @RequestBody ProjectCreateRequest request) {
        Long projectId = projectService.createProject(request);
        return ResponseEntity.created(URI.create("/api/projects/" + projectId)).build();
    }
} 