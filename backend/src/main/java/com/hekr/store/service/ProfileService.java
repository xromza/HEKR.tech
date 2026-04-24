package com.hekr.store.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.hekr.store.dto.user.UserResponseDto;
import com.hekr.store.mapper.user.UserMapper;
import com.hekr.store.model.user.User;
import com.hekr.store.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final UserMapper userMapper;
    private final UserRepository userRepository;

    public UserResponseDto getProfileData(UserDetails userDetails) {
        User user = userRepository
                .findByLogin(userDetails.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден"));

        return userMapper.toResponse(user);
    }
}
