package com.justin.vitalog.api.domain.chat.repository;

import com.justin.vitalog.api.domain.chat.domain.Chat;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    List<Chat> findByProjectId(Long projectId);
    void deleteByProjectId(Long projectId);
} 