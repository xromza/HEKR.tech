package com.hekr.store.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hekr.store.auth.AuthRefreshRequestDto;
import com.hekr.store.auth.AuthRequestDto;
import com.hekr.store.auth.AuthResponseDto;
import com.hekr.store.auth.UserRegistrationDto;
import com.hekr.store.dto.StatusDto;
import com.hekr.store.exceptions.UserAlreadyExistsException;
import com.hekr.store.model.IndividualDetails;
import com.hekr.store.model.LegalDetails;
import com.hekr.store.model.User;
import com.hekr.store.model.UserToken;
import com.hekr.store.repository.IndividualDetailsRepository;
import com.hekr.store.repository.LegalDetailsRepository;
import com.hekr.store.repository.UserRepository;
import com.hekr.store.repository.UserTokenRepository;
import com.hekr.store.utils.ClientType;
import com.hekr.store.utils.UserRole;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final UserTokenRepository userTokenRepository;
    private final IndividualDetailsRepository individualDetailsRepository;
    private final LegalDetailsRepository legalDetailsRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AuthResponseDto register(UserRegistrationDto request) {
        if (userRepository.existsByLogin(request.getLogin())) {
            throw new UserAlreadyExistsException("Пользователь с данным логином уже существует");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Пользователь с данным email уже существует");
        }
        User user = User.builder()
                        .login(request.getLogin())
                        .email(request.getEmail())
                        .phone(request.getPhone())
                        .passwordHash(passwordEncoder.encode(request.getPassword()))
                        .role(UserRole.CLIENT)
                        .isApproved(ClientType.INDIVIDUAL.equals(request.getClientType()))
                        .clientType(request.getClientType())
                        .createdAt(LocalDateTime.now())
                        .build();
        
        User savedUser = userRepository.save(user);

        if (ClientType.INDIVIDUAL.equals(request.getClientType())) {
            IndividualDetails individualDetails = IndividualDetails.builder()
            .birthDate(request.getBirthDate())
            .firstName(request.getFirstName())
            .midName(request.getMidName())
            .lastName(request.getLastName())
            .passportNumber(request.getPassportNumber())
            .passportSeries(request.getPassportSeries())
            .user(savedUser)
            .build();

            individualDetailsRepository.save(individualDetails);
        } else if (ClientType.LEGAL.equals(request.getClientType())) {
            LegalDetails legalDetails = LegalDetails.builder()
            .companyName(request.getCompanyName())
            .inn(request.getInn())
            .kpp(request.getKpp())
            .legalAddress(request.getLegalAddress())
            .ogrn(request.getOgrn())
            .user(savedUser)
            .build();

            legalDetailsRepository.save(legalDetails);
        }
        String jwtToken = jwtService.generateToken(user);
        UserToken refreshToken = jwtService.generateRefreshToken(user);
        userTokenRepository.save(refreshToken);
        return AuthResponseDto.builder()
                              .accessToken(jwtToken)
                              .refreshToken(refreshToken.getToken())
                              .description("Successful registered")
                              .role(user.getRole())
                              .build();
                        
    }

    @Transactional
    public AuthResponseDto refreshAccessToken(AuthRefreshRequestDto request) {
        String refreshToken = request.getRefreshToken();
        UserToken userToken = userTokenRepository.findActiveByRefreshToken(refreshToken).orElseThrow(() -> new UsernameNotFoundException("User not found by credentials"));
        User user = userToken.getUser();

        if (!jwtService.isTokenValid(refreshToken, user)) {
            userToken.setRevoked(true);
            userTokenRepository.save(userToken);
            throw new BadCredentialsException("Refresh token expired");
        }

        String jwtToken = jwtService.generateToken(user);
        return AuthResponseDto.builder()
                                .accessToken(jwtToken)
                                .refreshToken(refreshToken)
                                .role(user.getRole())
                                .description("Token refreshed")
                                .build();
    }

    @Transactional
    public AuthResponseDto authenticate(AuthRequestDto request) {
        User user = userRepository.findByLogin(request.getLogin()).orElseThrow(() -> new BadCredentialsException("Неверный логин или пароль"));
        
        if (!user.getIsApproved())
            throw new DisabledException("Ваш аккаунт ожидает подтверждения администратором");
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash()))
            throw new BadCredentialsException("Неверный логин или пароль");
        
        revokeAllTokens(user);

        String jwtToken = jwtService.generateToken(user);
        UserToken refreshToken = jwtService.generateRefreshToken(user);
        userTokenRepository.save(refreshToken);
        return AuthResponseDto.builder()
                              .accessToken(jwtToken)
                              .refreshToken(refreshToken.getToken())
                              .description("Успешный вход")
                              .role(user.getRole())
                              .build();
    }

    private void revokeAllTokens(User user) {
        List<UserToken> validUserTokens = userTokenRepository.findAllValidTokensByUser(user.getId());
        validUserTokens.forEach((token) -> {
            token.setRevoked(true);
        }); 
        userTokenRepository.saveAll(validUserTokens);
    }

    @Transactional
    public StatusDto logout(AuthRefreshRequestDto request) {
        String refreshToken = request.getRefreshToken();
        UserToken userToken = userTokenRepository.findActiveByRefreshToken(refreshToken).orElseThrow(() -> new BadCredentialsException("Token not found"));
        userToken.setRevoked(true);
        userTokenRepository.save(userToken);
        return StatusDto.builder()
                        .status("ok")
                        .description("Токен отозван")
                        .build();
    }

}
