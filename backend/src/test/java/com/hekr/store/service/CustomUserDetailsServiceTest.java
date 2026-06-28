package com.hekr.store.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.hekr.store.model.user.User;
import com.hekr.store.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class CustomUserDetailsServiceTest { // ← Имя совпадает с тестируемым классом

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CustomUserDetailsService customUserDetailsService; // ← правильный класс

    @Test
    void loadUserByUsername_UserExists_ReturnsUserDetails() {
        // Arrange
        String login = "testuser@example.com";
        User user = new User();
        user.setId(1L);
        user.setLogin(login);
        user.setPasswordHash("encodedPassword");

        when(userRepository.findByLogin(login)).thenReturn(Optional.of(user));

        // Act
        UserDetails result = customUserDetailsService.loadUserByUsername(login);

        // Assert
        assertNotNull(result);
        assertEquals(login, result.getUsername());
        assertEquals("encodedPassword", result.getPassword());

        verify(userRepository).findByLogin(login);
    }

    @Test
    void loadUserByUsername_UserNotFound_ThrowsUsernameNotFoundException() {
        // Arrange
        String login = "nonexistent@example.com";
        when(userRepository.findByLogin(login)).thenReturn(Optional.empty());

        // Act & Assert
        UsernameNotFoundException exception = assertThrows(UsernameNotFoundException.class,
                () -> customUserDetailsService.loadUserByUsername(login));

        assertEquals("User not found with login: " + login, exception.getMessage());
        verify(userRepository).findByLogin(login);
    }
}