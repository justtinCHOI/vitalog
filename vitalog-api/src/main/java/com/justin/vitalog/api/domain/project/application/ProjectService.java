package com.justin.vitalog.api.domain.project.application;

import com.justin.vitalog.api.domain.chat.dto.ChatResponse;
import com.justin.vitalog.api.domain.chat.repository.ChatRepository;
import com.justin.vitalog.api.domain.member.domain.Member;
import com.justin.vitalog.api.domain.member.repository.MemberRepository;
import com.justin.vitalog.api.domain.project.domain.Project;
import com.justin.vitalog.api.domain.project.dto.ProjectCreateRequest;
import com.justin.vitalog.api.domain.project.dto.ProjectDetailResponse;
import com.justin.vitalog.api.domain.project.dto.ProjectResponse;
import com.justin.vitalog.api.domain.project.repository.ProjectRepository;
import com.justin.vitalog.api.domain.summary.dto.SummaryResponse;
import com.justin.vitalog.api.global.config.security.SecurityUtils;
import com.justin.vitalog.api.global.exception.CustomException;
import com.justin.vitalog.api.global.exception.ErrorCode;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final MemberRepository memberRepository;
    private final ChatRepository chatRepository;

    @Transactional(readOnly = true)
    public ProjectDetailResponse getProjectDetails(Long projectId) {
        Long memberId = SecurityUtils.getCurrentMemberId()
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("프로젝트를 찾을 수 없습니다."));

        if (!project.getMember().getId().equals(memberId)) {
            throw new RuntimeException("프로젝트에 접근할 권한이 없습니다.");
        }

        List<ChatResponse> chats = chatRepository.findByProjectId(projectId).stream()
                .map(ChatResponse::from)
                .collect(Collectors.toList());

        return ProjectDetailResponse.from(project, chats);
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getMyProjects() {
        Long memberId = SecurityUtils.getCurrentMemberId()
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        return projectRepository.findByMemberId(memberId).stream()
                .map(ProjectResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public Long createProject(ProjectCreateRequest request) {
        Long memberId = SecurityUtils.getCurrentMemberId()
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        Project project = Project.builder()
                .name(request.getName())
                .member(member)
                .build();

        Project savedProject = projectRepository.save(project);
        return savedProject.getId();
    }

    public ProjectDetailResponse getProjectById(Long memberId, Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND_PROJECT));
        if (!project.getMember().getId().equals(memberId)) {
            throw new CustomException(ErrorCode.OTHER_SERVER_FORBIDDEN);
        }

        List<SummaryResponse> summaries = project.getSummaries().stream()
                .map(summary -> SummaryResponse.builder()
                        .id(summary.getId())
                        .content(summary.getContent())
                        .createdAt(summary.getCreatedAt())
                        .build())
                .toList();

        return ProjectDetailResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .createdAt(project.getCreatedAt())
                .summaries(summaries)
                .build();
    }
} 