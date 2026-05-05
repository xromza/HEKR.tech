package com.hekr.store.config;

import io.jsonwebtoken.security.SignatureException;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.MethodArgumentNotValidException;

import com.hekr.store.dto.error.ErrorResponseDto;
import com.hekr.store.dto.error.MapErrorResponseDto;
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
                                                .description("Плохая подпись токена. не балуйся")
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
                                .error("ValidationError")
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
        public ResponseEntity<MapErrorResponseDto> handleNEI(NotEnoughItems ex) {
                return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(
                                MapErrorResponseDto.builder().error(ex.getMessage()).errors(ex.getErrors()).build());
        }

        @ExceptionHandler(EmptyException.class)
        public ResponseEntity<ErrorResponseDto> handleEmpty(EmptyException ex) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ErrorResponseDto
                                .builder()
                                .error("Empty")
                                .description(ex.getMessage())
                                .build());
        }
}