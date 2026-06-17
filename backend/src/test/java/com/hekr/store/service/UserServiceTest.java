package com.hekr.store.service;

import com.hekr.store.exceptions.UserAlreadyExistsException;
import com.hekr.store.model.user.User;
import com.hekr.store.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .login("testuser")
                .email("test@example.com")
                .passwordHash("encodedPassword")
                .isApproved(true)
                .build();
    }

    @Nested
    @DisplayName("Тесты получения системного пользователя (getSystem)")
    class GetSystemTests {

        @Test
        @DisplayName("Успешное получение системного пользователя")
        void getSystem_Success_ReturnsSystemUser() {
            // Arrange
            User systemUser = User.builder()
                    .id(0L)
                    .login("system")
                    .build();
            when(userRepository.findByLogin("system")).thenReturn(Optional.of(systemUser));

            // Act
            User result = userService.getSystem();

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getLogin()).isEqualTo("system");
            verify(userRepository).findByLogin("system");
        }

        @Test
        @DisplayName("Негативный: системный пользователь не найден")
        void getSystem_NotFound_ThrowsUsernameNotFoundException() {
            // Arrange
            when(userRepository.findByLogin("system")).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> userService.getSystem())
                    .isInstanceOf(UsernameNotFoundException.class)
                    .hasMessage("Системный пользователь не найден");

            verify(userRepository).findByLogin("system");
        }
    }

    @Nested
    @DisplayName("Тесты поиска пользователя по ID (findById)")
    class FindByIdTests {

        @Test
        @DisplayName("Успешный поиск пользователя по ID")
        void findById_Success_ReturnsUser() {
            // Arrange
            when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

            // Act
            User result = userService.findById(1L);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(1L);
            assertThat(result.getLogin()).isEqualTo("testuser");
            verify(userRepository).findById(1L);
        }

        @Test
        @DisplayName("Негативный: пользователь не найден по ID")
        void findById_NotFound_ThrowsUsernameNotFoundException() {
            // Arrange
            when(userRepository.findById(999L)).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> userService.findById(999L))
                    .isInstanceOf(UsernameNotFoundException.class)
                    .hasMessage("Пользователь не найден");

            verify(userRepository).findById(999L);
        }

        @Test
        @DisplayName("Edge-case: поиск по null ID")
        void findById_NullId_ThrowsException() {
            // Arrange
            when(userRepository.findById(null)).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> userService.findById(null))
                    .isInstanceOf(UsernameNotFoundException.class);

            verify(userRepository).findById(null);
        }
    }

    @Nested
    @DisplayName("Тесты поиска пользователя по логину (findByLogin)")
    class FindByLoginTests {

        @Test
        @DisplayName("Успешный поиск пользователя по логину")
        void findByLogin_Success_ReturnsUser() {
            // Arrange
            when(userRepository.findByLogin("testuser")).thenReturn(Optional.of(testUser));

            // Act
            User result = userService.findByLogin("testuser");

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getLogin()).isEqualTo("testuser");
            assertThat(result.getEmail()).isEqualTo("test@example.com");
            verify(userRepository).findByLogin("testuser");
        }

        @Test
        @DisplayName("Негативный: пользователь не найден по логину")
        void findByLogin_NotFound_ThrowsUsernameNotFoundException() {
            // Arrange
            String login = "nonexistent";
            when(userRepository.findByLogin(login)).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> userService.findByLogin(login))
                    .isInstanceOf(UsernameNotFoundException.class)
                    .hasMessage("Пользователь с логином " + login + " не найден");

            verify(userRepository).findByLogin(login);
        }

        @Test
        @DisplayName("Edge-case: поиск по null логину")
        void findByLogin_NullLogin_ThrowsException() {
            // Arrange
            when(userRepository.findByLogin(null)).thenReturn(Optional.empty());

            // Act & Assert
            assertThatThrownBy(() -> userService.findByLogin(null))
                    .isInstanceOf(UsernameNotFoundException.class);

            verify(userRepository).findByLogin(null);
        }
    }

    @Nested
    @DisplayName("Тесты проверки существования по логину (existsByLogin)")
    class ExistsByLoginTests {

        @Test
        @DisplayName("Пользователь существует по логину")
        void existsByLogin_UserExists_ReturnsTrue() {
            // Arrange
            when(userRepository.existsByLogin("testuser")).thenReturn(true);

            // Act
            boolean result = userService.existsByLogin("testuser");

            // Assert
            assertThat(result).isTrue();
            verify(userRepository).existsByLogin("testuser");
        }

        @Test
        @DisplayName("Пользователь не существует по логину")
        void existsByLogin_UserDoesNotExist_ReturnsFalse() {
            // Arrange
            when(userRepository.existsByLogin("nonexistent")).thenReturn(false);

            // Act
            boolean result = userService.existsByLogin("nonexistent");

            // Assert
            assertThat(result).isFalse();
            verify(userRepository).existsByLogin("nonexistent");
        }

        @Test
        @DisplayName("Edge-case: проверка null логина")
        void existsByLogin_NullLogin_ReturnsFalse() {
            // Arrange
            when(userRepository.existsByLogin(null)).thenReturn(false);

            // Act
            boolean result = userService.existsByLogin(null);

            // Assert
            assertThat(result).isFalse();
            verify(userRepository).existsByLogin(null);
        }
    }

    @Nested
    @DisplayName("Тесты проверки существования по email (existsByEmail)")
    class ExistsByEmailTests {

        @Test
        @DisplayName("Пользователь существует по email")
        void existsByEmail_UserExists_ReturnsTrue() {
            // Arrange
            when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

            // Act
            boolean result = userService.existsByEmail("test@example.com");

            // Assert
            assertThat(result).isTrue();
            verify(userRepository).existsByEmail("test@example.com");
        }

        @Test
        @DisplayName("Пользователь не существует по email")
        void existsByEmail_UserDoesNotExist_ReturnsFalse() {
            // Arrange
            when(userRepository.existsByEmail("nonexistent@example.com")).thenReturn(false);

            // Act
            boolean result = userService.existsByEmail("nonexistent@example.com");

            // Assert
            assertThat(result).isFalse();
            verify(userRepository).existsByEmail("nonexistent@example.com");
        }

        @Test
        @DisplayName("Edge-case: проверка null email")
        void existsByEmail_NullEmail_ReturnsFalse() {
            // Arrange
            when(userRepository.existsByEmail(null)).thenReturn(false);

            // Act
            boolean result = userService.existsByEmail(null);

            // Assert
            assertThat(result).isFalse();
            verify(userRepository).existsByEmail(null);
        }
    }

    @Nested
    @DisplayName("Тесты сохранения нового пользователя (saveNew)")
    class SaveNewTests {

        @Test
        @DisplayName("Успешное сохранение нового пользователя")
        void saveNew_Success_ReturnsSavedUser() {
            // Arrange
            when(userRepository.existsByEmail(testUser.getEmail())).thenReturn(false);
            when(userRepository.existsByLogin(testUser.getLogin())).thenReturn(false);
            when(userRepository.save(testUser)).thenReturn(testUser);

            // Act
            User result = userService.saveNew(testUser);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(1L);
            verify(userRepository).existsByEmail(testUser.getEmail());
            verify(userRepository).existsByLogin(testUser.getLogin());
            verify(userRepository).save(testUser);
        }

        @Test
        @DisplayName("Негативный: email уже существует")
        void saveNew_EmailExists_ThrowsUserAlreadyExistsException() {
            // Arrange
            when(userRepository.existsByEmail(testUser.getEmail())).thenReturn(true);

            // Act & Assert
            assertThatThrownBy(() -> userService.saveNew(testUser))
                    .isInstanceOf(UserAlreadyExistsException.class)
                    .hasMessage("Аккаунт с данным email уже зарегистрирован");

            verify(userRepository).existsByEmail(testUser.getEmail());
            verify(userRepository, never()).existsByLogin(anyString());
            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Негативный: логин уже существует")
        void saveNew_LoginExists_ThrowsUserAlreadyExistsException() {
            // Arrange
            when(userRepository.existsByEmail(testUser.getEmail())).thenReturn(false);
            when(userRepository.existsByLogin(testUser.getLogin())).thenReturn(true);

            // Act & Assert
            assertThatThrownBy(() -> userService.saveNew(testUser))
                    .isInstanceOf(UserAlreadyExistsException.class)
                    .hasMessage("Аккаунт с данным логином уже зарегистрирован");

            verify(userRepository).existsByEmail(testUser.getEmail());
            verify(userRepository).existsByLogin(testUser.getLogin());
            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Edge-case: сохранение пользователя с минимальными полями")
        void saveNew_MinimalUser_SavesSuccessfully() {
            // Arrange
            User minimalUser = User.builder()
                    .login("minimal")
                    .email("minimal@example.com")
                    .passwordHash("hash")
                    .build();

            when(userRepository.existsByEmail(minimalUser.getEmail())).thenReturn(false);
            when(userRepository.existsByLogin(minimalUser.getLogin())).thenReturn(false);
            when(userRepository.save(minimalUser)).thenReturn(minimalUser);

            // Act
            User result = userService.saveNew(minimalUser);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getLogin()).isEqualTo("minimal");
            verify(userRepository).save(minimalUser);
        }

        @Test
        @DisplayName("Проверка, что save вызывается с правильными данными")
        void saveNew_CapturesCorrectData() {
            // Arrange
            when(userRepository.existsByEmail(testUser.getEmail())).thenReturn(false);
            when(userRepository.existsByLogin(testUser.getLogin())).thenReturn(false);
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            // Act
            userService.saveNew(testUser);

            // Assert
            ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
            verify(userRepository).save(userCaptor.capture());
            User capturedUser = userCaptor.getValue();
            assertThat(capturedUser.getLogin()).isEqualTo("testuser");
            assertThat(capturedUser.getEmail()).isEqualTo("test@example.com");
        }
    }

    @Nested
    @DisplayName("Тесты обновления пользователя (update)")
    class UpdateTests {

        @Test
        @DisplayName("Успешное обновление пользователя")
        void update_Success_ReturnsUpdatedUser() {
            // Arrange
            User updatedUser = User.builder()
                    .id(1L)
                    .login("updateduser")
                    .email("updated@example.com")
                    .passwordHash("newHash")
                    .build();

            when(userRepository.save(updatedUser)).thenReturn(updatedUser);

            // Act
            User result = userService.update(updatedUser);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getLogin()).isEqualTo("updateduser");
            assertThat(result.getEmail()).isEqualTo("updated@example.com");
            verify(userRepository).save(updatedUser);
        }

        @Test
        @DisplayName("Обновление с частичными данными")
        void update_PartialUpdate_SavesCorrectly() {
            // Arrange
            User partialUser = User.builder()
                    .id(1L)
                    .phone("+7(999)123-45-67")
                    .build();

            when(userRepository.save(partialUser)).thenReturn(partialUser);

            // Act
            User result = userService.update(partialUser);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getPhone()).isEqualTo("+7(999)123-45-67");
            verify(userRepository).save(partialUser);
        }

        @Test
        @DisplayName("Edge-case: обновление несуществующего пользователя")
        void update_UserDoesNotExist_StillSaves() {
            // Arrange
            User nonExistentUser = User.builder()
                    .id(999L)
                    .login("nonexistent")
                    .build();

            when(userRepository.save(nonExistentUser)).thenReturn(nonExistentUser);

            // Act
            User result = userService.update(nonExistentUser);

            // Assert
            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(999L);
            verify(userRepository).save(nonExistentUser);
        }

        @Test
        @DisplayName("Проверка, что update передаёт правильные данные в репозиторий")
        void update_CapturesCorrectData() {
            // Arrange
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            // Act
            userService.update(testUser);

            // Assert
            ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
            verify(userRepository).save(userCaptor.capture());
            User capturedUser = userCaptor.getValue();
            assertThat(capturedUser.getId()).isEqualTo(testUser.getId());
            assertThat(capturedUser.getLogin()).isEqualTo(testUser.getLogin());
        }
    }
}