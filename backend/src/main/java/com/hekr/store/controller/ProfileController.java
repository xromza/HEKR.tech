package com.hekr.store.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hekr.store.dto.user.UserResponseDto;
import com.hekr.store.service.ProfileService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;

    @GetMapping
    public UserResponseDto getAccountDetails(@AuthenticationPrincipal UserDetails userDetails) {
        return profileService.getProfileData(userDetails);
    }

}
