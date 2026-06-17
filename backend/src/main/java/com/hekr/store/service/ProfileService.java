package com.hekr.store.service;

import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hekr.store.dto.user.UserEditDto;
import com.hekr.store.dto.user.UserResponseDto;
import com.hekr.store.mapper.user.UserEditMapper;
import com.hekr.store.mapper.user.UserMapper;
import com.hekr.store.model.user.User;
import com.hekr.store.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final UserMapper userMapper;
    private final UserEditMapper userEditMapper;
    private final UserRepository userRepository;
    private final AuthService authService;

    @Transactional(readOnly = true)
    public UserResponseDto getProfileData(UserDetails userDetails) {
        User user = userRepository
                .findByLogin(userDetails.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден"));
        if (!user.getIsApproved())
            throw new DisabledException("Ваш аккаунт ожидает подтверждения администратором");
        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponseDto updateProfileData(UserDetails userDetails, UserEditDto userEditDto) {
        User user = userRepository
                .findByLogin(userDetails.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден"));
        if (!user.getIsApproved())
            throw new DisabledException("Ваш аккаунт ожидает подтверждения администратором");
        User mapped = userEditMapper.updateEntity(userEditDto, user);
        if (org.springframework.util.StringUtils.hasText(userEditDto.getPassword())) {
            mapped = authService.changePassword(user, userEditDto.getPassword());
        }

        userRepository.save(mapped);
        return userMapper.toResponse(mapped);

    }
}
