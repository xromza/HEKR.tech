package com.hekr.store.service;

import com.hekr.store.dto.user.UserEditDto;
import com.hekr.store.dto.user.UserResponseDto;
import com.hekr.store.mapper.user.UserEditMapper;
import com.hekr.store.mapper.user.UserMapper;
import com.hekr.store.model.user.User;
import com.hekr.store.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProfileServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private UserEditMapper userEditMapper;

    @Mock
    private AuthService authService;

    @Mock
    private UserDetails userDetails;

    @InjectMocks
    private ProfileService profileService;

    private User testUser;
    private UserResponseDto testUserResponseDto;
    private UserEditDto testUserEditDto;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .login("testuser@example.com")
                .passwordHash("oldPasswordHash")
                .isApproved(true)
                .phone("+7(999)123-45-67")
                .build();

        testUserResponseDto = UserResponseDto.builder()
                .id(1L)
                .login("testuser@example.com")
                .phone("+7(999)123-45-67")
                .build();

        testUserEditDto = UserEditDto.builder()
                .phone("+7(999)999-99-99")
                .email("newemail@example.com")
                .build();
    }

    @Nested
    @DisplayName("Тесты получения профиля (getProfileData)")
    class GetProfileDataTests {

        @Test
        @DisplayName("Успешное получение профиля")
        void getProfileData_Success_ReturnsUserResponse() {
            // Arrange
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userRepository.findByLogin("testuser@example.com")).thenReturn(Optional.of(testUser));
            when(userMapper.toResponse(testUser)).thenReturn(testUserResponseDto);

            // Act
            UserResponseDto result = profileService.getProfileData(userDetails);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(1L);
            assertThat(result.getLogin()).isEqualTo("testuser@example.com");
            verify(userRepository).findByLogin("testuser@example.com");
            verify(userMapper).toResponse(testUser);
        }

        @Test
        @DisplayName("Негативный: пользователь не найден")
        void getProfileData_UserNotFound_ThrowsUsernameNotFoundException() {
            // Arrange
            when(userDetails.getUsername()).thenReturn("nonexistent@example.com");
            when(userRepository.findByLogin("nonexistent@example.com")).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> profileService.getProfileData(userDetails))
                    .isInstanceOf(UsernameNotFoundException.class)
                    .hasMessage("Пользователь не найден");

            verify(userRepository).findByLogin("nonexistent@example.com");
            verify(userMapper, never()).toResponse(any());
        }

        @Test
        @DisplayName("Негативный: аккаунт не подтверждён")
        void getProfileData_UserNotApproved_ThrowsDisabledException() {
            // Arrange
            testUser.setIsApproved(false);
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userRepository.findByLogin("testuser@example.com")).thenReturn(Optional.of(testUser));

            // Act & Assert
            assertThatThrownBy(() -> profileService.getProfileData(userDetails))
                    .isInstanceOf(DisabledException.class)
                    .hasMessage("Ваш аккаунт ожидает подтверждения администратором");

            verify(userRepository).findByLogin("testuser@example.com");
            verify(userMapper, never()).toResponse(any());
        }
    }

    @Nested
    @DisplayName("Тесты обновления профиля (updateProfileData)")
    class UpdateProfileDataTests {

        @Test
        @DisplayName("Успешное обновление профиля без смены пароля")
        void updateProfileData_SuccessWithoutPassword_ReturnsUpdatedUser() {
            // Arrange
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userRepository.findByLogin("testuser@example.com")).thenReturn(Optional.of(testUser));
            when(userEditMapper.updateEntity(testUserEditDto, testUser)).thenReturn(testUser);
            when(userMapper.toResponse(testUser)).thenReturn(testUserResponseDto);

            // Act
            UserResponseDto result = profileService.updateProfileData(userDetails, testUserEditDto);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(1L);
            verify(userRepository).findByLogin("testuser@example.com");
            verify(userEditMapper).updateEntity(testUserEditDto, testUser);
            verify(authService, never()).changePassword(any(), anyString());
            verify(userRepository).save(testUser);
            verify(userMapper).toResponse(testUser);
        }

        @Test
        @DisplayName("Успешное обновление профиля со сменой пароля")
        void updateProfileData_SuccessWithPassword_ReturnsUpdatedUser() {
            // Arrange
            UserEditDto editDtoWithPassword = UserEditDto.builder()
                    .phone("+7(999)999-99-99")
                    .email("newemail@example.com")
                    .password("newPassword123")
                    .build();

            User updatedUser = User.builder()
                    .id(1L)
                    .login("testuser@example.com")
                    .passwordHash("newPasswordHash")
                    .isApproved(true)
                    .build();

            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userRepository.findByLogin("testuser@example.com")).thenReturn(Optional.of(testUser));
            when(userEditMapper.updateEntity(editDtoWithPassword, testUser)).thenReturn(testUser);
            when(authService.changePassword(testUser, "newPassword123")).thenReturn(updatedUser);
            when(userMapper.toResponse(updatedUser)).thenReturn(testUserResponseDto);

            // Act
            UserResponseDto result = profileService.updateProfileData(userDetails, editDtoWithPassword);

            // Assert
            assertThat(result).isNotNull();
            verify(userEditMapper).updateEntity(editDtoWithPassword, testUser);
            verify(authService).changePassword(testUser, "newPassword123");
            verify(userRepository).save(updatedUser);
        }

        @Test
        @DisplayName("Негативный: пользователь не найден при обновлении")
        void updateProfileData_UserNotFound_ThrowsUsernameNotFoundException() {
            // Arrange
            when(userDetails.getUsername()).thenReturn("nonexistent@example.com");
            when(userRepository.findByLogin("nonexistent@example.com")).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> profileService.updateProfileData(userDetails, testUserEditDto))
                    .isInstanceOf(UsernameNotFoundException.class)
                    .hasMessage("Пользователь не найден");

            verify(userRepository).findByLogin("nonexistent@example.com");
            verify(userEditMapper, never()).updateEntity(any(), any());
            verify(authService, never()).changePassword(any(), any());
            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Негативный: аккаунт не подтверждён при обновлении")
        void updateProfileData_UserNotApproved_ThrowsDisabledException() {
            // Arrange
            testUser.setIsApproved(false);
            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userRepository.findByLogin("testuser@example.com")).thenReturn(Optional.of(testUser));

            // Act & Assert
            assertThatThrownBy(() -> profileService.updateProfileData(userDetails, testUserEditDto))
                    .isInstanceOf(DisabledException.class)
                    .hasMessage("Ваш аккаунт ожидает подтверждения администратором");

            verify(userRepository).findByLogin("testuser@example.com");
            verify(userEditMapper, never()).updateEntity(any(), any());
            verify(authService, never()).changePassword(any(), any());
            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Edge-case: обновление с пустым DTO")
        void updateProfileData_EmptyDto_StillUpdates() {
            // Arrange
            UserEditDto emptyDto = UserEditDto.builder().build();

            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userRepository.findByLogin("testuser@example.com")).thenReturn(Optional.of(testUser));
            when(userEditMapper.updateEntity(emptyDto, testUser)).thenReturn(testUser);
            when(userMapper.toResponse(testUser)).thenReturn(testUserResponseDto);

            // Act
            UserResponseDto result = profileService.updateProfileData(userDetails, emptyDto);

            // Assert
            assertThat(result).isNotNull();
            verify(userEditMapper).updateEntity(emptyDto, testUser);
            verify(authService, never()).changePassword(any(), any());
            verify(userRepository).save(testUser);
        }

        @Test
        @DisplayName("Edge-case: обновление с пустым паролем (не null, но пустая строка)")
        void updateProfileData_EmptyPassword_DoesNotChangePassword() {
            // Arrange
            UserEditDto editDtoWithEmptyPassword = UserEditDto.builder()
                    .phone("+7(999)999-99-99")
                    .password("")
                    .build();

            when(userDetails.getUsername()).thenReturn("testuser@example.com");
            when(userRepository.findByLogin("testuser@example.com")).thenReturn(Optional.of(testUser));
            when(userEditMapper.updateEntity(editDtoWithEmptyPassword, testUser)).thenReturn(testUser);
            when(userMapper.toResponse(testUser)).thenReturn(testUserResponseDto);

            // Act
            UserResponseDto result = profileService.updateProfileData(userDetails, editDtoWithEmptyPassword);

            // Assert
            assertThat(result).isNotNull();
            verify(authService, never()).changePassword(any(), anyString());
        }
    }
}