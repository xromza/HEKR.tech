package com.hekr.store.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hekr.store.dto.user.UserEditDto;
import com.hekr.store.dto.user.UserResponseDto;
import com.hekr.store.service.ProfileService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;

    @GetMapping
    public UserResponseDto getAccountDetails(@AuthenticationPrincipal UserDetails userDetails) {
        return profileService.getProfileData(userDetails);
    }

    @PatchMapping
    public UserResponseDto updateAccountDetails(@AuthenticationPrincipal UserDetails userDetails, @Valid @RequestBody UserEditDto userEditDto) {
        return profileService.updateProfileData(userDetails, userEditDto);
    }
}
