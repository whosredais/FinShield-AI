package com.finshield.core_banking.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        
        // 1. On cherche le header "Authorization" dans la requête
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // 2. Si pas de header ou s'il ne commence pas par "Bearer ", on laisse passer (Spring Security bloquera plus loin)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. On extrait le token (après "Bearer ")
        jwt = authHeader.substring(7);
        
        // 4. On extrait le pseudo (username) du token
        userEmail = jwtService.extractUsername(jwt);

        // 5. Si on a un pseudo et que l'utilisateur n'est pas encore authentifié dans le contexte
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // On charge les détails de l'utilisateur depuis la BDD
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
            
            // 6. Si le token est valide
            if (jwtService.isTokenValid(jwt, userDetails)) {
                // On crée l'objet d'authentification
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                // 7. On met à jour le contexte de sécurité (Le tampon "VALIDÉ")
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        // 8. On passe la main à la suite
        filterChain.doFilter(request, response);
    }
}