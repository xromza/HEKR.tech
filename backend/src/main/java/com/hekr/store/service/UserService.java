package com.hekr.store.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hekr.store.dto.user.UserResponseDto;
import com.hekr.store.exceptions.UserAlreadyExistsException;
import com.hekr.store.interfaces.UserProvider;
import com.hekr.store.mapper.user.UserMapper;
import com.hekr.store.model.user.User;
import com.hekr.store.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService implements UserProvider {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public User getApprovedUserByLogin(String login) {
        User user = userRepository
                .findByLogin(login)
                .orElseThrow(() -> new UsernameNotFoundException("Пользователь с логином " + login + " не найден"));
        if (!user.getIsApproved())
            throw new DisabledException("Ваш аккаунт ожидает подтверждения администратором");
        return user;
    }

    public User getSystem() {
        return userRepository.findByLogin("system")
                .orElseThrow(() -> new UsernameNotFoundException("Системный пользователь не найден"));
    }

    public User findById(Long id) {
        return userRepository
                .findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден"));
    }

    public User findByLogin(String login) {
        return userRepository
                .findByLogin(login)
                .orElseThrow(() -> new UsernameNotFoundException("Пользователь с логином " + login + " не найден"));
    }

    public boolean existsByLogin(String login) {
        return userRepository.existsByLogin(login);
    }

    public boolean existsByEmail(String login) {
        return userRepository.existsByEmail(login);
    }

    @Transactional
    public User saveNew(User user) {
        if (existsByEmail(user.getEmail()))
            throw new UserAlreadyExistsException("Аккаунт с данным email уже зарегистрирован");
        if (existsByLogin(user.getLogin()))
            throw new UserAlreadyExistsException("Аккаунт с данным логином уже зарегистрирован");
        return userRepository.save(user);
    }

    @Transactional
    public User update(User user) {
        return userRepository.save(user);
    }

    public List<User> getAllByIsApproved(Pageable pageable, boolean isApproved) {
        return userRepository.findByIsApproved(pageable, isApproved);
    }

    public Page<UserResponseDto> getAll(Pageable pageable) {
        Page<User> usersPage = userRepository.findAll(pageable);
        return usersPage.map(userMapper::toResponse);
    }

}
