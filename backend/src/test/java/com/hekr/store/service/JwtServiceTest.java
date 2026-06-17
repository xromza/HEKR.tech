package com.hekr.store.service;

import com.hekr.store.model.user.User;
import com.hekr.store.model.user.UserToken;
import com.hekr.store.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Date;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserDetails userDetails;

    @InjectMocks
    private JwtService jwtService;

    private static final String TEST_SECRET_KEY = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    private static final long JWT_EXPIRATION = 3600000;
    private static final long REFRESH_EXPIRATION = 86400000;

    private User testUser;
    private String testLogin;

    @BeforeEach
    void setUp() {
        testLogin = "testuser@example.com";

        testUser = User.builder()
                .id(1L)
                .login(testLogin)
                .passwordHash("encodedPassword")
                .isApproved(true)
                .build();

        when(userDetails.getUsername()).thenReturn(testLogin);

        ReflectionTestUtils.setField(jwtService, "secretKey", TEST_SECRET_KEY);
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", JWT_EXPIRATION);
        ReflectionTestUtils.setField(jwtService, "refreshExpiration", REFRESH_EXPIRATION);
    }

    @Test
    void generateToken_Success_ReturnsValidToken() {
        // Act
        String token = jwtService.generateToken(userDetails);

        // Assert
        assertThat(token).isNotNull();
        assertThat(token).isNotEmpty();
    }

    @Test
    void extractUsername_Success_ReturnsUsername() {
        // Arrange
        String token = jwtService.generateToken(userDetails);

        // Act
        String result = jwtService.extractUsername(token);

        // Assert
        assertThat(result).isEqualTo(testLogin);
    }

    @Test
    void isTokenValid_ValidToken_ReturnsTrue() {
        // Arrange
        String token = jwtService.generateToken(userDetails);

        // Act
        boolean isValid = jwtService.isTokenValid(token, userDetails);

        // Assert
        assertThat(isValid).isTrue();
    }

    @Test
    void generateRefreshToken_Success_ReturnsUserToken() {
        // Arrange
        when(userRepository.findByLogin(testLogin)).thenReturn(Optional.of(testUser));

        // Act
        UserToken userToken = jwtService.generateRefreshToken(userDetails);

        // Assert
        assertThat(userToken).isNotNull();
        assertThat(userToken.getToken()).isNotEmpty();
        assertThat(userToken.getRevoked()).isFalse();
        assertThat(userToken.getUser()).isEqualTo(testUser);
    }

    @Test
    void isTokenValid_WrongUsername_ReturnsFalse() {
        // Arrange
        String token = jwtService.generateToken(userDetails);
        UserDetails wrongUser = mock(UserDetails.class);
        when(wrongUser.getUsername()).thenReturn("wronguser@example.com");

        // Act
        boolean isValid = jwtService.isTokenValid(token, wrongUser);

        // Assert
        assertThat(isValid).isFalse();
    }

    @Test
    void extractExpiration_Success_ReturnsExpirationDate() {
        // Arrange
        String token = jwtService.generateToken(userDetails);

        // Act
        Date expiration = jwtService.extractExpiration(token);

        // Assert
        assertThat(expiration).isNotNull();
        assertThat(expiration).isAfter(new Date());
    }
}