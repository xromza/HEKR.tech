package com.hekr.store.service;

import com.hekr.store.dto.auth.*;
import com.hekr.store.dto.individual_details.IndividualDetailsRequestDto;
import com.hekr.store.dto.legal_details.LegalDetailsRequestDto;
import com.hekr.store.dto.status.StatusDto;
import com.hekr.store.exceptions.AuthException;
import com.hekr.store.mapper.individual_details.IndividualDetailsRequestMapper;
import com.hekr.store.mapper.legal_details.LegalDetailsRequestMapper;
import com.hekr.store.model.individual_details.IndividualDetails;
import com.hekr.store.model.legal_details.LegalDetails;
import com.hekr.store.model.user.User;
import com.hekr.store.model.user.UserToken;
import com.hekr.store.repository.UserTokenRepository;
import com.hekr.store.utils.ClientType;
import com.hekr.store.utils.UserRole;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

        @Mock
        private UserService userService;

        @Mock
        private UserTokenRepository userTokenRepository;

        @Mock
        private PasswordEncoder passwordEncoder;

        @Mock
        private JwtService jwtService;

        @Mock
        private IndividualDetailsRequestMapper individualDetailsRequestMapper;

        @Mock
        private LegalDetailsRequestMapper legalDetailsRequestMapper;

        @InjectMocks
        private AuthService authService;

        @BeforeEach
        void setUp() {
                ReflectionTestUtils.setField(authService, "refreshExpiration", 86400000L); // 24 часа
        }

        @Nested
        @DisplayName("Тесты регистрации (register)")
        class RegisterTests {

                @Test
                @DisplayName("Успешная регистрация физического лица")
                void register_Individual_Success() {
                        // Arrange
                        var individualDetails = IndividualDetailsRequestDto.builder()
                                        .firstName("Иван")
                                        .lastName("Иванов")
                                        .passportNumber("1234567890")
                                        .build();

                        var request = UserRegistrationDto.builder()
                                        .login("ivan123")
                                        .email("ivan@example.com")
                                        .phone("+79123456789")
                                        .password("password123")
                                        .details(individualDetails)
                                        .build();

                        var individualEntity = new IndividualDetails();
                        var savedUser = User.builder()
                                        .id(1L)
                                        .login("ivan123")
                                        .role(UserRole.CLIENT)
                                        .build();

                        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
                        when(individualDetailsRequestMapper.toEntity(individualDetails)).thenReturn(individualEntity);
                        when(jwtService.generateToken(any(User.class))).thenReturn("access-token");
                        when(jwtService.generateRefreshToken(any(User.class)))
                                        .thenReturn(UserToken.builder().token("refresh-token").build());
                        when(userService.saveNew(any(User.class))).thenReturn(savedUser);

                        // Act
                        AuthResult result = authService.register(request);

                        // Assert
                        assertThat(result.getAccessToken()).isEqualTo("access-token");
                        assertThat(result.getRefreshToken().getToken()).isEqualTo("refresh-token");
                        assertThat(result.getAuthResponseDto().getRole()).isEqualTo(UserRole.CLIENT);
                        assertThat(result.getAuthResponseDto().getDescription()).contains("Successful");

                        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
                        verify(userService).saveNew(userCaptor.capture());
                        User capturedUser = userCaptor.getValue();
                        assertThat(capturedUser.getLogin()).isEqualTo("ivan123");
                        assertThat(capturedUser.getClientType()).isEqualTo(ClientType.INDIVIDUAL);
                        assertThat(capturedUser.getIsApproved()).isTrue();
                        assertThat(capturedUser.getIndividualDetails()).isEqualTo(individualEntity);

                        verify(userTokenRepository).save(any(UserToken.class));
                }

                @Test
                @DisplayName("Успешная регистрация юридического лица (требует подтверждения)")
                void register_Legal_Success_RequiresApproval() {
                        // Arrange
                        var legalDetails = LegalDetailsRequestDto.builder()
                                        .companyName("ООО Ромашка")
                                        .inn("1234567890")
                                        .kpp("123456789")
                                        .build();

                        var request = UserRegistrationDto.builder()
                                        .login("company123")
                                        .email("company@example.com")
                                        .phone("+79123456789")
                                        .password("password123")
                                        .details(legalDetails)
                                        .build();

                        var legalEntity = new LegalDetails();

                        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
                        when(legalDetailsRequestMapper.toEntity(legalDetails)).thenReturn(legalEntity);
                        when(jwtService.generateToken(any(User.class))).thenReturn("access-token");
                        when(jwtService.generateRefreshToken(any(User.class)))
                                        .thenReturn(UserToken.builder().token("refresh-token").build());

                        // Act
                        authService.register(request);

                        // Assert
                        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
                        verify(userService).saveNew(userCaptor.capture());
                        User capturedUser = userCaptor.getValue();
                        assertThat(capturedUser.getClientType()).isEqualTo(ClientType.LEGAL);
                        assertThat(capturedUser.getIsApproved()).isFalse();
                        assertThat(capturedUser.getLegalDetails()).isEqualTo(legalEntity);
                }

                @Test
                @DisplayName("Edge-case: неизвестный тип клиента -> выброс AuthException")
                void register_UnknownClientType_ThrowsAuthException() {
                        // Arrange
                        var request = UserRegistrationDto.builder()
                                        .login("test")
                                        .email("test@test.com")
                                        .phone("+79123456789")
                                        .password("password")
                                        .details(null)
                                        .build();

                        // Act & Assert
                        assertThatThrownBy(() -> authService.register(request))
                                        .isInstanceOf(AuthException.class)
                                        .hasMessage("Неизвестный тип клиента");

                        verify(userService, never()).saveNew(any());
                }

                @Test
                @DisplayName("Edge-case: регистрация без телефона (обязательные поля)")
                void register_MissingPhone_ShouldPassValidationButNull() {
                        // Arrange
                        var request = UserRegistrationDto.builder()
                                        .login("test")
                                        .email("test@test.com")
                                        .password("password")
                                        .details(IndividualDetailsRequestDto.builder().build())
                                        .build();

                        when(passwordEncoder.encode(any())).thenReturn("encoded");
                        when(individualDetailsRequestMapper.toEntity(any())).thenReturn(new IndividualDetails());
                        when(jwtService.generateToken(any())).thenReturn("token");
                        when(jwtService.generateRefreshToken(any()))
                                        .thenReturn(UserToken.builder().token("refresh").build());

                        // Act
                        authService.register(request);

                        // Assert
                        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
                        verify(userService).saveNew(captor.capture());
                        assertThat(captor.getValue().getPhone()).isNull();
                }
        }

        @Nested
        @DisplayName("Тесты аутентификации (authenticate)")
        class AuthenticateTests {

                private User createValidUser() {
                        return User.builder()
                                        .id(1L)
                                        .login("testuser")
                                        .passwordHash("encodedPassword")
                                        .role(UserRole.CLIENT)
                                        .isApproved(true)
                                        .build();
                }

                @Test
                @DisplayName("Успешная аутентификация с валидными данными")
                void authenticate_Success() {
                        // Arrange
                        var request = new AuthRequestDto("testuser", "password123");
                        var user = createValidUser();

                        when(userService.findByLogin("testuser")).thenReturn(user);
                        when(passwordEncoder.matches("password123", "encodedPassword")).thenReturn(true);
                        
                        // Метод deleteAllByUserId возвращает void, мокировать behavior не нужно, только верифицировать
                        doNothing().when(userTokenRepository).deleteAllByUserId(1L); 
                        
                        when(jwtService.generateToken(user)).thenReturn("new-access-token");
                        when(jwtService.generateRefreshToken(user))
                                        .thenReturn(UserToken.builder().token("new-refresh-token").build());

                        // Act
                        AuthResult result = authService.authenticate(request);

                        // Assert
                        assertThat(result.getAccessToken()).isEqualTo("new-access-token");
                        assertThat(result.getRefreshToken().getToken()).isEqualTo("new-refresh-token");
                        assertThat(result.getAuthResponseDto().getDescription()).isEqualTo("Успешный вход");

                        // Проверяем физическое удаление старых токенов по id пользователя
                        verify(userTokenRepository).deleteAllByUserId(1L);
                        verify(userTokenRepository).save(any(UserToken.class));
                }

                @Test
                @DisplayName("Аутентификация вызывает удаление старых токенов")
                void authenticate_DeletesExistingTokens() {
                        // Arrange
                        var request = new AuthRequestDto("testuser", "password");
                        var user = createValidUser();

                        when(userService.findByLogin("testuser")).thenReturn(user);
                        when(passwordEncoder.matches(any(), any())).thenReturn(true);
                        when(jwtService.generateToken(user)).thenReturn("new-token");
                        when(jwtService.generateRefreshToken(user))
                                        .thenReturn(UserToken.builder().token("refresh").build());

                        // Act
                        authService.authenticate(request);

                        // Assert
                        // Проверяем, что метод репозитория на удаление был гарантированно вызван
                        verify(userTokenRepository).deleteAllByUserId(1L);
                        verify(userTokenRepository).save(any(UserToken.class));
                }

                @Test
                @DisplayName("Негативный: пользователь не найден")
                void authenticate_UserNotFound_ThrowsException() {
                        // Arrange
                        var request = new AuthRequestDto("unknown", "password");
                        when(userService.findByLogin("unknown"))
                                        .thenThrow(new UsernameNotFoundException("User not found"));

                        // Act & Assert
                        assertThatThrownBy(() -> authService.authenticate(request))
                                        .isInstanceOf(UsernameNotFoundException.class);
                }

                @Test
                @DisplayName("Негативный: аккаунт не подтвержден (isApproved = false)")
                void authenticate_AccountNotApproved_ThrowsDisabledException() {
                        // Arrange
                        var request = new AuthRequestDto("testuser", "password");
                        var user = User.builder()
                                        .login("testuser")
                                        .passwordHash("encoded")
                                        .isApproved(false)
                                        .build();

                        when(userService.findByLogin("testuser")).thenReturn(user);

                        // Act & Assert
                        assertThatThrownBy(() -> authService.authenticate(request))
                                        .isInstanceOf(DisabledException.class)
                                        .hasMessage("Ваш аккаунт ожидает подтверждения администратором");

                        verify(passwordEncoder, never()).matches(any(), any());
                }

                @Test
                @DisplayName("Негативный: неверный пароль")
                void authenticate_WrongPassword_ThrowsBadCredentialsException() {
                        // Arrange
                        var request = new AuthRequestDto("testuser", "wrongpassword");
                        var user = createValidUser();

                        when(userService.findByLogin("testuser")).thenReturn(user);
                        when(passwordEncoder.matches("wrongpassword", "encodedPassword")).thenReturn(false);

                        // Act & Assert
                        assertThatThrownBy(() -> authService.authenticate(request))
                                        .isInstanceOf(BadCredentialsException.class)
                                        .hasMessage("Неверный логин или пароль");
                }

                @Test
                @DisplayName("Edge-case: пустой логин или пароль")
                void authenticate_EmptyCredentials_ShouldPassToService() {
                        // Arrange
                        var request = new AuthRequestDto("", "");
                        var user = createValidUser();

                        when(userService.findByLogin("")).thenReturn(user);
                        when(passwordEncoder.matches("", "encodedPassword")).thenReturn(false);

                        // Act & Assert
                        assertThatThrownBy(() -> authService.authenticate(request))
                                        .isInstanceOf(BadCredentialsException.class);
                }
        }

        @Nested
        @DisplayName("Тесты обновления токена (refreshAccessToken)")
        class RefreshTokenTests {

                private User createUser() {
                        return User.builder()
                                        .id(1L)
                                        .login("testuser")
                                        .passwordHash("encoded")
                                        .build();
                }

                private UserToken createValidToken(User user) {
                        return UserToken.builder()
                                        .id(1L)
                                        .token("valid-refresh-token")
                                        .user(user)
                                        .expiryDate(LocalDateTime.now().plusHours(24))
                                        .revoked(false)
                                        .build();
                }

                @Test
                @DisplayName("Успешное обновление access-токена")
                void refreshAccessToken_Success() {
                        // Arrange
                        var user = createUser();
                        var token = createValidToken(user);

                        when(userTokenRepository.findActiveByRefreshToken("valid-refresh-token"))
                                        .thenReturn(Optional.of(token));
                        when(jwtService.isTokenValid("valid-refresh-token", user)).thenReturn(true);
                        when(jwtService.generateToken(user)).thenReturn("new-access-token");

                        // Act
                        AuthResult result = authService.refreshAccessToken("valid-refresh-token");

                        // Assert
                        assertThat(result.getAccessToken()).isEqualTo("new-access-token");
                        assertThat(result.getRefreshToken()).isEqualTo(token);
                        assertThat(result.getAuthResponseDto().getDescription()).isEqualTo("Token refreshed");
                        assertThat(result.getRefreshTokenDuration()).isGreaterThan(0);
                }

                @Test
                @DisplayName("Негативный: refresh-токен не найден")
                void refreshAccessToken_TokenNotFound_ThrowsException() {
                        // Arrange
                        when(userTokenRepository.findActiveByRefreshToken("invalid-token"))
                                        .thenReturn(Optional.empty());

                        // Act & Assert
                        assertThatThrownBy(() -> authService.refreshAccessToken("invalid-token"))
                                        .isInstanceOf(UsernameNotFoundException.class)
                                        .hasMessage("User not found by credentials");
                }

                @Test
                @DisplayName("Негативный: refresh-токен просрочен или невалиден")
                void refreshAccessToken_InvalidToken_RevokesAndThrows() {
                        // Arrange
                        var user = createUser();
                        var token = createValidToken(user);

                        when(userTokenRepository.findActiveByRefreshToken("expired-token"))
                                        .thenReturn(Optional.of(token));
                        when(jwtService.isTokenValid("expired-token", user)).thenReturn(false);

                        // Act & Assert
                        assertThatThrownBy(() -> authService.refreshAccessToken("expired-token"))
                                        .isInstanceOf(BadCredentialsException.class)
                                        .hasMessage("Refresh token expired");

                        assertThat(token.getRevoked()).isTrue();
                        verify(userTokenRepository).save(token);
                        verify(jwtService, never()).generateToken(any());
                }

                @Test
                @DisplayName("Edge-case: refresh-токен истекает через несколько секунд")
                void refreshAccessToken_TokenNearExpiration_ReturnsCorrectSecondsLeft() {
                        // Arrange
                        var user = createUser();
                        var token = UserToken.builder()
                                        .token("token")
                                        .user(user)
                                        .expiryDate(LocalDateTime.now().plusSeconds(30))
                                        .revoked(false)
                                        .build();

                        when(userTokenRepository.findActiveByRefreshToken("token"))
                                        .thenReturn(Optional.of(token));
                        when(jwtService.isTokenValid("token", user)).thenReturn(true);
                        when(jwtService.generateToken(user)).thenReturn("new-token");

                        // Act
                        AuthResult result = authService.refreshAccessToken("token");

                        // Assert
                        assertThat(result.getRefreshTokenDuration()).isBetween(29L, 31L);
                }
        }

        @Nested
        @DisplayName("Тесты выхода (logout)")
        class LogoutTests {

                @Test
                @DisplayName("Успешный выход: токен отзывается")
                void logout_Success() {
                        // Arrange
                        var token = UserToken.builder()
                                        .id(1L)
                                        .token("refresh-token")
                                        .revoked(false)
                                        .build();

                        when(userTokenRepository.findActiveByRefreshToken("refresh-token"))
                                        .thenReturn(Optional.of(token));

                        // Act
                        StatusDto result = authService.logout("refresh-token");

                        // Assert
                        assertThat(result.getStatus()).isEqualTo("Ok");
                        assertThat(result.getDescription()).isEqualTo("Токен отозван");
                        assertThat(token.getRevoked()).isTrue();
                        verify(userTokenRepository).save(token);
                }

                @Test
                @DisplayName("Негативный: попытка выхода с несуществующим токением")
                void logout_TokenNotFound_ThrowsException() {
                        // Arrange
                        when(userTokenRepository.findActiveByRefreshToken("invalid-token"))
                                        .thenReturn(Optional.empty());

                        // Act & Assert
                        assertThatThrownBy(() -> authService.logout("invalid-token"))
                                        .isInstanceOf(BadCredentialsException.class)
                                        .hasMessage("Token not found");

                        verify(userTokenRepository, never()).save(any());
                }
        }

        @Nested
        @DisplayName("Тесты смены пароля (changePassword)")
        class ChangePasswordTests {

                @Test
                @DisplayName("Успешная смена пароля с физическим удалением токенов")
                void changePassword_Success() {
                        // Arrange
                        var user = User.builder()
                                        .id(1L)
                                        .login("testuser")
                                        .passwordHash("oldHash")
                                        .build();

                        when(passwordEncoder.encode("newPassword")).thenReturn("newEncodedHash");
                        when(userService.update(any(User.class))).thenReturn(user);

                        // Act
                        User result = authService.changePassword(user, "newPassword");

                        // Assert
                        assertThat(result.getPasswordHash()).isEqualTo("newEncodedHash");
                        // Проверяем, что метод удаления токенов юзера вызвался вместо старого saveAll
                        verify(userTokenRepository).deleteAllByUserId(1L);
                        verify(userService).update(user);
                }

                @Test
                @DisplayName("Edge-case: смена пароля на пустую строку")
                void changePassword_EmptyPassword_StillEncodes() {
                        // Arrange
                        var user = User.builder().id(1L).build();
                        when(passwordEncoder.encode("")).thenReturn("encodedEmpty");
                        when(userService.update(any())).thenReturn(user);

                        // Act
                        authService.changePassword(user, "");

                        // Assert
                        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
                        verify(userService).update(captor.capture());
                        assertThat(captor.getValue().getPasswordHash()).isEqualTo("encodedEmpty");
                        verify(userTokenRepository).deleteAllByUserId(1L);
                }
        }
}