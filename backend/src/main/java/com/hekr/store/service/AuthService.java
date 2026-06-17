package com.hekr.store.service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hekr.store.dto.auth.AuthRequestDto;
import com.hekr.store.dto.auth.AuthResponseDto;
import com.hekr.store.dto.auth.AuthResult;
import com.hekr.store.dto.auth.UserRegistrationDto;
import com.hekr.store.dto.individual_details.IndividualDetailsRequestDto;
import com.hekr.store.dto.legal_details.LegalDetailsRequestDto;
import com.hekr.store.dto.status.StatusDto;
import com.hekr.store.exceptions.AuthException;
import com.hekr.store.interfaces.DetailsRequestInterface;
import com.hekr.store.mapper.individual_details.IndividualDetailsRequestMapper;
import com.hekr.store.mapper.legal_details.LegalDetailsRequestMapper;
import com.hekr.store.model.individual_details.IndividualDetails;
import com.hekr.store.model.legal_details.LegalDetails;
import com.hekr.store.model.user.User;
import com.hekr.store.model.user.UserToken;
import com.hekr.store.repository.UserTokenRepository;
import com.hekr.store.utils.ClientType;
import com.hekr.store.utils.UserRole;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserService userService;
    private final UserTokenRepository userTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final IndividualDetailsRequestMapper individualDetailsRequestMapper;
    private final LegalDetailsRequestMapper legalDetailsRequestMapper;


    @Value("${application.security.jwt.refresh-token.expiration}")
    private long refreshExpiration;

    @Transactional
    public AuthResult register(UserRegistrationDto request) {
        User user = User.builder()
                .login(request.getLogin())
                .email(request.getEmail())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.CLIENT)
                .createdAt(LocalDateTime.now())
                .build();
        DetailsRequestInterface details = request.getDetails();
        if (details instanceof IndividualDetailsRequestDto indDto) {
            IndividualDetails individualEntity = individualDetailsRequestMapper.toEntity(indDto);

            individualEntity.setUser(user);

            
            user.setIndividualDetails(individualEntity);
            user.setClientType(ClientType.INDIVIDUAL);
            user.setIsApproved(true);
        } else if (details instanceof LegalDetailsRequestDto legalDto) {

            LegalDetails legalEntity = legalDetailsRequestMapper.toEntity(legalDto);

            legalEntity.setUser(user);

            user.setLegalDetails(legalEntity);
            user.setClientType(ClientType.LEGAL);
            user.setIsApproved(false);
        } else {
            throw new AuthException("Неизвестный тип клиента");
        }
        userService.saveNew(user);
        String jwtToken = jwtService.generateToken(user);
        UserToken refreshToken = jwtService.generateRefreshToken(user);
        userTokenRepository.save(refreshToken);
        return AuthResult.builder().authResponseDto(
                AuthResponseDto.builder()
                        .accessToken(jwtToken)
                        .description("Successful registered")
                        .role(user.getRole())
                        .build())
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .refreshTokenDuration(refreshExpiration / 1000)
                .build();

    }

    @Transactional
    public AuthResult refreshAccessToken(String refreshToken) {
        UserToken userToken = userTokenRepository.findActiveByRefreshToken(refreshToken)
                .orElseThrow(() -> new UsernameNotFoundException("User not found by credentials"));
        User user = userToken.getUser();

        if (!jwtService.isTokenValid(refreshToken, user)) {
            userToken.setRevoked(true);
            userTokenRepository.save(userToken);
            throw new BadCredentialsException("Refresh token expired");
        }
        long secondsLeft = ChronoUnit.SECONDS.between(LocalDateTime.now(), userToken.getExpiryDate());
        String jwtToken = jwtService.generateToken(user);
        return AuthResult.builder()
                .authResponseDto(
                        AuthResponseDto.builder()
                                .accessToken(jwtToken)
                                .role(user.getRole())
                                .description("Token refreshed")
                                .build())
                .accessToken(jwtToken)
                .refreshToken(userToken)
                .refreshTokenDuration(secondsLeft)
                .build();

    }

    @Transactional
    public AuthResult authenticate(AuthRequestDto request) {
        User user = userService.findByLogin(request.getLogin());

        if (!user.getIsApproved())
            throw new DisabledException("Ваш аккаунт ожидает подтверждения администратором");
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash()))
            throw new BadCredentialsException("Неверный логин или пароль");

        revokeAllTokens(user);

        String jwtToken = jwtService.generateToken(user);
        UserToken refreshToken = jwtService.generateRefreshToken(user);
        userTokenRepository.save(refreshToken);
        return AuthResult
                .builder()
                .authResponseDto(
                        AuthResponseDto.builder()
                                .accessToken(jwtToken)
                                .description("Успешный вход")
                                .role(user.getRole())
                                .build())
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .refreshTokenDuration(refreshExpiration / 1000)
                .build();
    }

    @Transactional
    private void revokeAllTokens(User user) {
        List<UserToken> validUserTokens = userTokenRepository.findAllValidTokensByUser(user.getId());
        validUserTokens.forEach((token) -> {
            token.setRevoked(true);
        });
        userTokenRepository.saveAll(validUserTokens);
    }

    @Transactional
    public StatusDto logout(String refreshToken) {
        UserToken userToken = userTokenRepository.findActiveByRefreshToken(refreshToken)
                .orElseThrow(() -> new BadCredentialsException("Token not found"));
        userToken.setRevoked(true);
        userTokenRepository.save(userToken);
        return StatusDto.builder()
                .status("Ok")
                .description("Токен отозван")
                .build();
    }
    
    @Transactional
    protected User changePassword(User user, String password) {
        user.setPasswordHash(passwordEncoder.encode(password));
        revokeAllTokens(user);
        return userService.update(user);
    }

}
