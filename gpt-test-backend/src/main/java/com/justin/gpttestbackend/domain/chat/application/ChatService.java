package com.justin.gpttestbackend.domain.chat.application;

import com.justin.gpttestbackend.chatgpt.ChatGPTClient;
import com.justin.gpttestbackend.chatgpt.dto.request.ChatGPTRequest;
import com.justin.gpttestbackend.chatgpt.dto.response.ChatGPTResponse;
import com.justin.gpttestbackend.domain.chat.domain.Chat;
import com.justin.gpttestbackend.domain.chat.dto.ChatAnalysisResponse;
import com.justin.gpttestbackend.domain.chat.dto.ChatResponse;
import com.justin.gpttestbackend.domain.chat.repository.ChatRepository;
import com.justin.gpttestbackend.domain.project.domain.Project;
import com.justin.gpttestbackend.domain.project.repository.ProjectRepository;
import com.justin.gpttestbackend.domain.summary.domain.Summary;
import com.justin.gpttestbackend.domain.summary.repository.SummaryRepository;
import com.justin.gpttestbackend.global.exception.CustomException;
import com.justin.gpttestbackend.global.exception.ErrorCode;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final ProjectRepository projectRepository;
    private final ChatGPTClient chatGPTClient;
    private final ObjectMapper objectMapper;
    private final SummaryRepository summaryRepository;

    @Transactional
    public void importChatsFromCsv(Long projectId, MultipartFile file) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND_PROJECT));

        List<Chat> chats = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            // KaKaoTalk chat log format
            // 1st line: Title
            // 2nd line: Saved date
            // 3rd line: ----------...
            // 4th line: blank
            // 5th line~: chat contents
            reader.lines().skip(4).forEach(line -> {
                if (line.startsWith("---------------")) {
                    return;
                }

                Pattern pattern = Pattern.compile("(\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}),\"(.+?)\",\"(.+?)\"");
                Matcher matcher = pattern.matcher(line);

                if (matcher.find()) {
                    String date = matcher.group(1);
                    String name = matcher.group(2);
                    String message = matcher.group(3).replaceAll("\"\"", "\"");

                    Chat chat = Chat.builder()
                            .project(project)
                            .date(date)
                            .name(name)
                            .message(message)
                            .build();
                    chats.add(chat);
                }
            });
        } catch (IOException e) {
            throw new RuntimeException("CSV 파일 처리 중 오류가 발생했습니다.", e);
        }

        chatRepository.saveAll(chats);
    }

    @Transactional(readOnly = true)
    public List<ChatResponse> getAllChatsByProjectId(Long projectId) {
        return chatRepository.findByProjectId(projectId).stream()
                .map(chat -> ChatResponse.builder()
                        .id(chat.getId())
                        .name(chat.getName())
                        .message(chat.getMessage())
                        .date(chat.getDate())
                        .build())
                .toList();
    }

    @Transactional(readOnly = true)
    public ChatAnalysisResponse analyzeChats(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND_PROJECT));

        List<Chat> chats = chatRepository.findByProjectId(projectId);
        String chatHistory = chats.stream()
                .map(chat -> chat.getName() + ": " + chat.getMessage())
                .collect(Collectors.joining("\n"));

        ChatGPTRequest request = createChatAnalysisRequest(chatHistory);
        ChatGPTResponse response = chatGPTClient.call(request);

        try {
            String jsonContent = response.choices().get(0).message().content();
            ChatAnalysisResponse analysisResponse = objectMapper.readValue(jsonContent, ChatAnalysisResponse.class);

            Summary summary = Summary.builder()
                    .project(project)
                    .content(analysisResponse.getSummary())
                    .build();
            summaryRepository.save(summary);

            return analysisResponse;
        } catch (JsonProcessingException e) {
            throw new RuntimeException("ChatGPT 응답 처리 중 오류 발생", e);
        }
    }

    private ChatGPTRequest createChatAnalysisRequest(String chatHistory) {
        String systemMessage = "You are a conversation analysis expert. Analyze the following conversation and provide a summary, key topics, and sentiment analysis for each speaker. Please provide the output in a JSON format matching the given schema.";

        ChatGPTRequest.Schema schema = new ChatGPTRequest.Schema(
                "object",
                Map.of(
                        "summary", Map.of("type", "string", "description", "A summary of the conversation."),
                        "key_topics", Map.of("type", "array", "description", "A list of key topics discussed.", "items", Map.of("type", "string")),
                        "sentiment_analysis", Map.of("type", "array", "description", "Sentiment analysis for each speaker.", "items",
                                new ChatGPTRequest.Schema("object", Map.of(
                                        "speaker", Map.of("type", "string"),
                                        "sentiment", Map.of("type", "string", "description", "The speaker's overall sentiment (e.g., Positive, Negative, Neutral).")
                                ), new String[]{"speaker", "sentiment"}, false)
                        )
                ),
                new String[]{"summary", "key_topics", "sentiment_analysis"},
                false
        );

        return new ChatGPTRequest(
                "gpt-4o-2024-08-06",
                List.of(
                        new ChatGPTRequest.Message("system", systemMessage),
                        new ChatGPTRequest.Message("user", chatHistory)
                ),
                new ChatGPTRequest.ResponseFormat("json_schema", new ChatGPTRequest.JsonSchema("chat_analysis", schema)),
                4000
        );
    }
} 