package com.hekr.store.service;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.hekr.store.exceptions.UserAlreadyExistsException;
import com.hekr.store.model.user.User;
import com.hekr.store.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

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

    public User saveNew(User user) {
        if (existsByEmail(user.getEmail()))
            throw new UserAlreadyExistsException("Аккаунт с данным email уже зарегистрирован");
        if (existsByLogin(user.getLogin()))
            throw new UserAlreadyExistsException("Аккаунт с данным логином уже зарегистрирован");
        return userRepository.save(user);
    }

    public User update(User user) {
        return userRepository.save(user);
    }
}
