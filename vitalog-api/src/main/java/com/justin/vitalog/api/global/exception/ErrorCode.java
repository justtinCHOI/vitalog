package com.justin.vitalog.api.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    // Feign Client
    OTHER_SERVER_BAD_REQUEST(HttpStatus.BAD_REQUEST, "FEIGN_400_1", "다른 서버의 잘못된 요청입니다."),
    OTHER_SERVER_UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "FEIGN_401_1", "다른 서버의 인증에 실패했습니다."),
    OTHER_SERVER_FORBIDDEN(HttpStatus.FORBIDDEN, "FEIGN_403_1", "다른 서버의 접근이 금지되었습니다."),
    OTHER_SERVER_NOT_FOUND(HttpStatus.NOT_FOUND, "FEIGN_404_1", "다른 서버의 리소스를 찾을 수 없습니다."),
    OTHER_SERVER_EXPIRED_TOKEN(HttpStatus.UNAUTHORIZED, "FEIGN_419_1", "다른 서버의 토큰이 만료되었습니다."),
    OTHER_SERVER_INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "FEIGN_500_1", "다른 서버의 내부 오류가 발생했습니다."),

    NOT_FOUND_PROJECT(HttpStatus.NOT_FOUND, "PROJECT_404_1", "프로젝트를 찾을 수 없습니다."),

    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "SERVER_500_1", "서버 내부 오류가 발생했습니다.");

    private final HttpStatus status;
    private final String code;
    private final String reason;
} 