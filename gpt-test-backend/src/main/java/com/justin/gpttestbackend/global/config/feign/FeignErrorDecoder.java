package com.justin.gpttestbackend.global.config.feign;

import com.justin.gpttestbackend.global.exception.CustomException;
import com.justin.gpttestbackend.global.exception.ErrorCode;
import feign.Response;
import feign.codec.ErrorDecoder;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class FeignErrorDecoder implements ErrorDecoder {

    @Override
    public Exception decode(String methodKey, Response response) {
        log.error("[{}] request failed with status: {}, reason: {}", methodKey, response.status(), response.reason());
        if (response.status() >= 400) {
            return switch (response.status()) {
                case 400 -> new CustomException(ErrorCode.OTHER_SERVER_BAD_REQUEST);
                case 401 -> new CustomException(ErrorCode.OTHER_SERVER_UNAUTHORIZED);
                case 403 -> new CustomException(ErrorCode.OTHER_SERVER_FORBIDDEN);
                case 404 -> new CustomException(ErrorCode.OTHER_SERVER_NOT_FOUND);
                case 419 -> new CustomException(ErrorCode.OTHER_SERVER_EXPIRED_TOKEN);
                default -> new CustomException(
                        ErrorCode.OTHER_SERVER_INTERNAL_SERVER_ERROR);
            };
        }
        return new CustomException(ErrorCode.INTERNAL_SERVER_ERROR);
    }
} 