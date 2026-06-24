package com.hekr.store.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.servlet.HandlerExceptionResolver;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
        private final JwtAuthenticationFilter jwtAuthenticationFilter;
        private final AuthenticationProvider authenticationProvider;
        private final HandlerExceptionResolver resolver;

        public SecurityConfig(
                        JwtAuthenticationFilter jwtAuthenticationFilter,
                        AuthenticationProvider authenticationProvider,
                        @Qualifier("handlerExceptionResolver") HandlerExceptionResolver resolver) {
                this.jwtAuthenticationFilter = jwtAuthenticationFilter;
                this.authenticationProvider = authenticationProvider;
                this.resolver = resolver;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .cors(cors -> cors.configurationSource(request -> {
                                        var corsConfiguration = new CorsConfiguration();
                                        corsConfiguration.setAllowedOriginPatterns(
                                                        List.of("http://localhost:3000", "http://192.168.*.*:3000",
                                                                        "https://dev.hekr.tech", "https://hekr.tech"));
                                        corsConfiguration.setAllowedMethods(
                                                        List.of("GET", "POST", "DELETE", "OPTIONS", "PUT", "PATCH"));
                                        corsConfiguration.setAllowedHeaders(List.of("*"));
                                        corsConfiguration.setAllowCredentials(true);
                                        return corsConfiguration;
                                }))
                                .csrf(AbstractHttpConfigurer::disable)
                                .exceptionHandling(exceptions -> exceptions
                                                .authenticationEntryPoint((request, response, authException) -> resolver
                                                                .resolveException(request, response, null,
                                                                                authException))
                                                .accessDeniedHandler((request, response,
                                                                accessDeniedException) -> resolver.resolveException(
                                                                                request, response, null,
                                                                                accessDeniedException)))
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers("/swagger-ui/**").permitAll()
                                                .requestMatchers("/v3/api-docs/**").permitAll()
                                                .requestMatchers("/api/v1/auth").permitAll()
                                                .requestMatchers("/api/v1/auth/**").permitAll()
                                                .requestMatchers("/api/v1/products").permitAll()
                                                .requestMatchers("/api/v1/products/*").permitAll()
                                                .requestMatchers("/api/v1/header").permitAll()
                                                .requestMatchers("/api/v1/profile")
                                                .hasAnyAuthority("ROLE_ADMIN", "ROLE_CLIENT", "ROLE_MANAGER")
                                                .requestMatchers("/api/v1/products/category/*").permitAll()
                                                .requestMatchers("/api/v1/profile/*")
                                                .hasAnyAuthority("ROLE_ADMIN", "ROLE_CLIENT", "ROLE_MANAGER")
                                                .requestMatchers("/api/v1/cart")
                                                .hasAnyAuthority("ROLE_ADMIN", "ROLE_CLIENT", "ROLE_MANAGER")
                                                .requestMatchers("/api/v1/cart/*")
                                                .hasAnyAuthority("ROLE_ADMIN", "ROLE_CLIENT", "ROLE_MANAGER")
                                                .requestMatchers(HttpMethod.POST, "/api/v1/cart/migrate")
                                                .hasAnyAuthority("ROLE_ADMIN", "ROLE_CLIENT", "ROLE_MANAGER")
                                                .requestMatchers(HttpMethod.POST, "/api/v1/orders/preview")
                                                .hasAnyAuthority("ROLE_ADMIN", "ROLE_CLIENT", "ROLE_MANAGER")
                                                .requestMatchers(HttpMethod.GET, "/api/v1/orders")
                                                .hasAnyAuthority("ROLE_ADMIN", "ROLE_CLIENT", "ROLE_MANAGER")
                                                .requestMatchers(HttpMethod.POST, "/api/v1/orders")
                                                .hasAnyAuthority("ROLE_ADMIN", "ROLE_CLIENT", "ROLE_MANAGER")
                                                .requestMatchers(HttpMethod.GET, "/api/v1/orders/history")
                                                .hasAnyAuthority("ROLE_ADMIN", "ROLE_CLIENT", "ROLE_MANAGER")
                                                .requestMatchers(HttpMethod.PATCH, "/api/v1/profile")
                                                .hasAnyAuthority("ROLE_ADMIN", "ROLE_CLIENT", "ROLE_MANAGER")
                                                .requestMatchers(HttpMethod.POST, "/api/v1/admin/products")
                                                .hasAnyAuthority("ROLE_ADMIN", "ROLE_MANAGER")
                                                .requestMatchers(HttpMethod.PATCH, "/api/v1/admin/products/*")
                                                .hasAnyAuthority("ROLE_ADMIN", "ROLE_MANAGER")
                                                .requestMatchers(HttpMethod.POST, "/api/v1/admin/categories")
                                                .hasAnyAuthority("ROLE_ADMIN", "ROLE_MANAGER")
                                                .requestMatchers(HttpMethod.POST, "/api/v1/admin/warehouses")
                                                .hasAuthority("ROLE_ADMIN")
                                                .requestMatchers(HttpMethod.GET, "/api/v1/admin/warehouses")
                                                .hasAnyAuthority("ROLE_ADMIN", "ROLE_MANAGER")
                                                .requestMatchers(HttpMethod.GET, "/api/v1/admin/users")
                                                .hasAuthority("ROLE_ADMIN")
                                                .requestMatchers(HttpMethod.PATCH, "/api/v1/admin/users/*")
                                                .hasAuthority("ROLE_ADMIN")
                                                .requestMatchers(HttpMethod.PATCH, "/api/v1/admin/orders/*/status")
                                                .hasAnyAuthority("ROLE_ADMIN", "ROLE_MANAGER")
                                                .requestMatchers(HttpMethod.PUT, "/api/v1/admin/stock")
                                                .hasAnyAuthority("ROLE_ADMIN", "ROLE_MANAGER")
                                                .requestMatchers(HttpMethod.POST, "/api/v1/admin/products/*/variants")
                                                .hasAnyAuthority("ROLE_ADMIN", "ROLE_MANAGER")
                                                .requestMatchers(HttpMethod.PATCH,
                                                                "/api/v1/admin/products/*/variants/*")
                                                .hasAnyAuthority("ROLE_ADMIN", "ROLE_MANAGER")
                                                .requestMatchers(HttpMethod.POST,
                                                                "/api/v1/admin/products/*/variants/*/images")
                                                .hasAnyAuthority("ROLE_ADMIN", "ROLE_MANAGER")
                                                .requestMatchers(HttpMethod.DELETE,
                                                                "/api/v1/admin/products/*/variants/*/images/*")
                                                .hasAnyAuthority("ROLE_ADMIN", "ROLE_MANAGER")
                                                .requestMatchers(HttpMethod.PATCH, "/api/v1/admin/discounts/*")
                                                .hasAnyAuthority("ROLE_ADMIN", "ROLE_MANAGER")
                                                .anyRequest().authenticated())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                                .authenticationProvider(authenticationProvider)
                                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}
