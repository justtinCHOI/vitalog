package com.justin.gpttestbackend.domain.chat.dto;

import com.justin.gpttestbackend.domain.chat.domain.Chat;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
public class ChatResponse {
    private final Long id;
    private final String date;
    private final String name;
    private final String message;

    @Builder
    public ChatResponse(Long id, String date, String name, String message) {
        this.id = id;
        this.date = date;
        this.name = name;
        this.message = message;
    }

    public static ChatResponse from(Chat chat) {
        return ChatResponse.builder()
                .id(chat.getId())
                .date(chat.getDate().toString())
                .name(chat.getName())
                .message(chat.getMessage())
                .build();
    }
} 