package com.hekr.store.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hekr.store.dto.user.UserResponseDto;
import com.hekr.store.exceptions.NotFoundException;
import com.hekr.store.mapper.user.UserMapper;
import com.hekr.store.model.user.User;
import com.hekr.store.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;

    private final UserMapper userMapper;
    
    @Transactional
    public UserResponseDto updateAccountStatus(Long id, Boolean approved) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));
        user.setIsApproved(approved);
        return userMapper.toResponse(userRepository.save(user));
    }

}
