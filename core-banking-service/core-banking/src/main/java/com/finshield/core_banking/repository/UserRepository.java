package com.finshield.core_banking.repository;

import com.finshield.core_banking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    // Cette méthode magique permet de trouver un user juste avec son nom
    Optional<User> findByUsername(String username);
}