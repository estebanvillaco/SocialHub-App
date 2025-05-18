package com.socialhub.socialhub_backend.repository;

import com.socialhub.socialhub_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, Long> {

<<<<<<< HEAD
    Optional<User> findByKeycloakId(UUID keycloakId);

    Optional<User> findByUsername(String username);

=======
    Optional<User> findByUsername(String username);

    Optional<User> findByKeycloakId(UUID keycloakId);
>>>>>>> mine/main

    Optional<User> findByEmail(String email);
}