package com.finshield.core_banking.auth;

import com.finshield.core_banking.config.JwtService;
import com.finshield.core_banking.entity.Role;
import com.finshield.core_banking.entity.User;
import com.finshield.core_banking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    // 1. INSCRIPTION INTELLIGENTE
    public AuthenticationResponse register(RegisterRequest request) {
        // Règle : Si le pseudo commence par "admin", c'est un chef !
        Role role = request.getUsername().toLowerCase().startsWith("admin") ? Role.ADMIN : Role.USER;

        var user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();
        
        repository.save(user);
        
        // IMPORTANT : On écrit le rôle DANS le token
        var jwtToken = jwtService.generateToken(Map.of("role", role.name()), user);
        return AuthenticationResponse.builder().token(jwtToken).build();
    }

    // 2. CONNEXION (On doit aussi mettre le rôle dans le token ici)
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        
        var user = repository.findByUsername(request.getUsername()).orElseThrow();
        
        // On renvoie le token avec le rôle à l'intérieur
        var jwtToken = jwtService.generateToken(Map.of("role", user.getRole().name()), user);
        return AuthenticationResponse.builder().token(jwtToken).build();
    }
}