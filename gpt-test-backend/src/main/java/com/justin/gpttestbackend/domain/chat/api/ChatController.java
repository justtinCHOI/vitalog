package com.justin.gpttestbackend.domain.chat.api;

import com.justin.gpttestbackend.domain.chat.application.ChatService;
import com.justin.gpttestbackend.domain.chat.dto.ChatAnalysisResponse;
import com.justin.gpttestbackend.domain.chat.dto.ChatResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping
    public ResponseEntity<List<ChatResponse>> getChatsByProjectId(@PathVariable Long projectId) {
        return ResponseEntity.ok(chatService.getAllChatsByProjectId(projectId));
    }

    @PostMapping("/import")
    public ResponseEntity<Void> importChatsFromCsv(
            @PathVariable Long projectId,
            @RequestParam("file") MultipartFile file) {
        chatService.importChatsFromCsv(projectId, file);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/analyze")
    public ResponseEntity<ChatAnalysisResponse> analyzeChats(
            @PathVariable Long projectId,
            @RequestParam(value = "language", required = false) String language) {
        return ResponseEntity.ok(chatService.analyzeChats(projectId, language));
    }
} 