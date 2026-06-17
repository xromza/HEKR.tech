package com.hekr.store.config;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.persistence.OptimisticLockException;
import tools.jackson.databind.exc.InvalidTypeIdException;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.MethodArgumentNotValidException;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import com.hekr.store.dto.error.ErrorResponseDto;
import com.hekr.store.dto.error.MapErrorResponseDto;
import com.hekr.store.dto.error.MapLongErrorResponseDto;
import com.hekr.store.exceptions.*;

@RestControllerAdvice
public class GlobalExceptionHandler {
        @ExceptionHandler(BadCredentialsException.class)
        public ResponseEntity<ErrorResponseDto> handleBadCredential(BadCredentialsException ex) {
                return ResponseEntity
                                .status(HttpStatus.UNAUTHORIZED)
                                .body(ErrorResponseDto
                                                .builder()
                                                .error("Unauthorized")
                                                .description(ex.getMessage())
                                                .build());
        }

        @ExceptionHandler(InsufficientAuthenticationException.class)
        public ResponseEntity<ErrorResponseDto> handleInsufficientAuthentication(
                        InsufficientAuthenticationException ex) {
                ErrorResponseDto error = new ErrorResponseDto("Unauthorized",
                                "Сначала необходимо авторизоваться в системе");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        @ExceptionHandler(AccessDeniedException.class)
        public ResponseEntity<ErrorResponseDto> handleAccessDenied(AccessDeniedException ex) {
                ErrorResponseDto error = new ErrorResponseDto("Forbidden",
                                "У вас недостаточно прав для выполнения этого действия");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        }

        @ExceptionHandler(DisabledException.class)
        public ResponseEntity<ErrorResponseDto> handleDisabledAccount(DisabledException ex) {
                return ResponseEntity
                                .status(HttpStatus.FORBIDDEN)
                                .body(ErrorResponseDto.builder()
                                                .error("AccountDisabled")
                                                .description(ex.getMessage())
                                                .build());
        }

        @ExceptionHandler(UserAlreadyExistsException.class)
        public ResponseEntity<ErrorResponseDto> handleUserAlreadyExists(UserAlreadyExistsException ex) {
                return ResponseEntity
                                .status(HttpStatus.CONFLICT)
                                .body(ErrorResponseDto.builder()
                                                .error("UserAlreadyExists")
                                                .description(ex.getMessage())
                                                .build());
        }

        @ExceptionHandler(NotFoundException.class)
        public ResponseEntity<ErrorResponseDto> handleNotFound(NotFoundException ex) {
                return ResponseEntity
                                .status(HttpStatus.NOT_FOUND)
                                .body(ErrorResponseDto.builder()
                                                .error("NotFound")
                                                .description(ex.getMessage())
                                                .build());
        }

        @ExceptionHandler(SignatureException.class)
        public ResponseEntity<ErrorResponseDto> handleSignatureException(SignatureException ex) {
                return ResponseEntity
                                .status(HttpStatus.UNAUTHORIZED)
                                .body(ErrorResponseDto
                                                .builder()
                                                .error("Unauthorized")
                                                .description("Плохая подпись токена")
                                                .build());
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<MapErrorResponseDto> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
                Map<String, String> fieldErrors = new HashMap<>();
                ex.getBindingResult().getAllErrors().forEach((error) -> {
                        String errorName = ((FieldError) error).getField();
                        String errorMessage = error.getDefaultMessage();
                        fieldErrors.put(errorName, errorMessage);
                });
                MapErrorResponseDto errors = MapErrorResponseDto.builder()
                                .error("ValidationMapError")
                                .errors(fieldErrors)
                                .build();

                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        }

        @ExceptionHandler(ForbiddenException.class)
        public ResponseEntity<ErrorResponseDto> handleForbidden(ForbiddenException ex) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                                ErrorResponseDto.builder()
                                                .description(ex.getMessage())
                                                .error("Forbidden")
                                                .build());
        }

        @ExceptionHandler(NotEnoughItems.class)
        public ResponseEntity<MapLongErrorResponseDto> handleNEI(NotEnoughItems ex) {
                return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(
                                MapLongErrorResponseDto.builder().error(ex.getMessage()).errors(ex.getErrors()).build());
        }

        @ExceptionHandler(EmptyException.class)
        public ResponseEntity<ErrorResponseDto> handleEmpty(EmptyException ex) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ErrorResponseDto
                                .builder()
                                .error("Empty")
                                .description(ex.getMessage())
                                .build());
        }

        @ExceptionHandler(AuthException.class)
        public ResponseEntity<ErrorResponseDto> handleAuth(AuthException ex) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ErrorResponseDto
                                .builder()
                                .error("AuthError")
                                .description(ex.getMessage())
                                .build());
        }

        @ExceptionHandler(UsernameNotFoundException.class)
        public ResponseEntity<ErrorResponseDto> handleUsernameNotFound(UsernameNotFoundException ex) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ErrorResponseDto
                                .builder()
                                .error("UsernameNotFound")
                                .description(ex.getMessage())
                                .build());
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<ErrorResponseDto> handleAllExceptions(Exception ex) {
                ex.printStackTrace();

                return ResponseEntity
                                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(ErrorResponseDto.builder()
                                                .error("InternalServerError")
                                                .description("Произошло что-то ужасное: " + ex.getMessage())
                                                .build());
        }

        @ExceptionHandler(HttpMessageNotReadableException.class)
        public ResponseEntity<ErrorResponseDto> handleMessageNotReadable(HttpMessageNotReadableException ex) {
                Throwable cause = ex.getCause();
                String friendlyMessage = "";
                if (cause instanceof InvalidTypeIdException) {
                        friendlyMessage = "Указан неизвестный тип данных в поле details";
                } else if (cause instanceof InvalidFormatException) {
                        friendlyMessage = "Одно из полей заполнено некорректно (неверный тип данных)";
                } else if (cause instanceof JsonParseException) {
                        friendlyMessage = "Ошибка в синтаксисе JSON";
                } else
                        friendlyMessage = ex.getMessage();

                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ErrorResponseDto
                                .builder()
                                .error("ValidationError")
                                .description(friendlyMessage)
                                .build());
        }

        @ExceptionHandler(ExpiredJwtException.class)
        public ResponseEntity<ErrorResponseDto> handleExpiredJwt(ExpiredJwtException ex) {
                return ResponseEntity
                                .status(HttpStatus.UNAUTHORIZED)
                                .body(ErrorResponseDto.builder()
                                                .error("ExpiredToken")
                                                .description("Токен устарел")
                                                .build());
        }

        @ExceptionHandler(OptimisticLockException.class)
        public ResponseEntity<ErrorResponseDto> handleOptimisticLockException(OptimisticLockException ex) {
                                return ResponseEntity
                                .status(HttpStatus.CONFLICT)
                                .body(ErrorResponseDto.builder()
                                                .error("DataChanged")
                                                .description("Другой пользователь внёс изменения")
                                                .build());
        }
}