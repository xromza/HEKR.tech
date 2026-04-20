package com.hekr.store.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/swagger-ui/**").permitAll()
                        .requestMatchers("/v3/api-docs/**").permitAll()
                        .requestMatchers("/api/v1/auth/*").permitAll()
                        .requestMatchers("/api/v1/products").permitAll()
                        .requestMatchers("/api/v1/products/*").permitAll()
                        .requestMatchers("/api/v1/profile").hasAnyRole("ADMIN", "CLIENT", "MANAGER")
                        .requestMatchers("/api/v1/profile/*").hasAnyRole("ADMIN", "CLIENT", "MANAGER")
                        .requestMatchers("/api/v1/cart").hasAnyRole("ADMIN", "CLIENT", "MANAGER")
                        .requestMatchers("/api/v1/cart/*").hasAnyRole("ADMIN", "CLIENT", "MANAGER")
                        .requestMatchers("/api/v1/orders").hasAnyRole("ADMIN", "CLIENT", "MANAGER")
                        .requestMatchers("/api/v1/orders/single").hasAnyRole("ADMIN", "CLIENT", "MANAGER")
                        .requestMatchers("/api/v1/order_history").hasAnyRole("ADMIN", "CLIENT", "MANAGER")
                        .requestMatchers("/api/v1/order_history").hasAnyRole("ADMIN", "CLIENT", "MANAGER")

                        .requestMatchers(HttpMethod.POST, "/api/v1/admin/products").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/v1/admin/products/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/v1/admin/categories").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/v1/admin/warehouses").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/v1/admin/warehouses").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.GET, "/api/v1/admin/users").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/v1/admin/users/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/v1/admin/orders/*/status")
                        .hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/admin/stock").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.POST, "/api/v1/admin/products/*/variants")
                        .hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PATCH, "/api/v1/admin/products/*/variants/*")
                        .hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.POST, "/api/v1/admin/products/*/variants/*/images")
                        .hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/admin/products/*/variants/*/images/*")
                        .hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PATCH, "/api/v1/admin/discounts/*").hasAnyRole("ADMIN", "MANAGER")
                        .anyRequest().authenticated())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
