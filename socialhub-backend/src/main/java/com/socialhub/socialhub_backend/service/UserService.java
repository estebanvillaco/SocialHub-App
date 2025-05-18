package com.socialhub.socialhub_backend.service;

import com.socialhub.socialhub_backend.dto.UserDto;
import com.socialhub.socialhub_backend.model.User;
import com.socialhub.socialhub_backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Keycloak keycloak;

    @Value("${keycloak.realm}")
    private String realm;

    private static final Logger LOGGER = Logger.getLogger(UserService.class.getName());

    private UUID parseKeycloakId(String keycloakId) {
        try {
            return UUID.fromString(keycloakId);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid keycloakId format: " + keycloakId, e);
        }
    }

    public User createUser(UserDto userDto) {
        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setKeycloakId(userDto.getKeycloakId());
        return userRepository.save(user);
    }

    public User updateUser(Long id, UserDto userDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setKeycloakId(userDto.getKeycloakId());

        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserByKeycloakId(String keycloakId) {
        UUID keycloakUuid = parseKeycloakId(keycloakId);
        return userRepository.findByKeycloakId(keycloakUuid)
                .orElseThrow(() -> new RuntimeException("User with keycloak_id not found"));
    }

    public User updateUserByKeycloakId(String keycloakId, UserDto userDto) {
        UUID keycloakUuid = parseKeycloakId(keycloakId);
        User user = userRepository.findByKeycloakId(keycloakUuid)
                .orElseThrow(() -> new RuntimeException("User with keycloak_id not found"));

        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());

        return userRepository.save(user);
    }

    /**
     * Synkroniserer bruker med Keycloak-bruker. Oppdaterer hvis e-post eller keycloakId matcher,
     * eller lager ny bruker hvis ingen matcher.
     */
    public User syncUser(UserDto userDto) {
        UUID keycloakUuid = userDto.getKeycloakId();
        if (keycloakUuid == null) {
            throw new RuntimeException("KeycloakId cannot be null");
        }

        Optional<User> existingUserByKeycloakId = userRepository.findByKeycloakId(keycloakUuid);
        if (existingUserByKeycloakId.isPresent()) {
            User existingUser = existingUserByKeycloakId.get();
            existingUser.setUsername(userDto.getUsername());
            existingUser.setEmail(userDto.getEmail());
            LOGGER.info("User synced by keycloakId: " + keycloakUuid);
            return userRepository.save(existingUser);
        }

        Optional<User> existingUserByEmail = userRepository.findByEmail(userDto.getEmail());
        if (existingUserByEmail.isPresent()) {
            User existingUser = existingUserByEmail.get();
            existingUser.setKeycloakId(keycloakUuid);
            existingUser.setUsername(userDto.getUsername());
            LOGGER.info("User synced by email: " + userDto.getEmail());
            return userRepository.save(existingUser);
        }

        User newUser = new User();
        newUser.setUsername(userDto.getUsername());
        newUser.setEmail(userDto.getEmail());
        newUser.setKeycloakId(keycloakUuid);
        LOGGER.info("New user created via sync: " + userDto.getEmail());
        return userRepository.save(newUser);
    }

    /**
     * Oppdaterer brukerinformasjon og passord i Keycloak. Endringene skjer atomisk.
     * Oppdaterer også profilbilde i lokal DB hvis angitt.
     */
    @Transactional
    public User updateUser(String keycloakId, String firstName, String lastName, String username, String email,
                           String password, MultipartFile profilePicture) throws IOException {

        UUID keycloakUuid = parseKeycloakId(keycloakId);
        User user = userRepository.findByKeycloakId(keycloakUuid)
                .orElseThrow(() -> new RuntimeException("User with keycloak_id not found"));

        // Oppdater lokal database (profilbilde og evt. andre lokale felt)
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setUsername(username);
        user.setEmail(email);

        if (profilePicture != null && !profilePicture.isEmpty()) {
            user.setProfilePicture(profilePicture.getBytes());
        }

        try {
            // Hent eksisterende Keycloak brukerrepresentasjon
            UserRepresentation keycloakUser = keycloak.realm(realm).users().get(keycloakId).toRepresentation();

            // Oppdater Keycloak brukerfelt
            keycloakUser.setFirstName(firstName);
            keycloakUser.setLastName(lastName);
            keycloakUser.setUsername(username);
            keycloakUser.setEmail(email);

            // Utfør oppdatering i Keycloak
            keycloak.realm(realm).users().get(keycloakId).update(keycloakUser);

            // Oppdater passord i Keycloak om oppgitt
            if (password != null && !password.isEmpty()) {
                CredentialRepresentation credential = new CredentialRepresentation();
                credential.setType(CredentialRepresentation.PASSWORD);
                credential.setValue(password);
                credential.setTemporary(false);

                keycloak.realm(realm).users().get(keycloakId).resetPassword(credential);
            }

            LOGGER.info("User info updated in Keycloak for user: " + keycloakId);

        } catch (Exception e) {
            LOGGER.severe("Failed to update user in Keycloak: " + e.getMessage());
            throw new RuntimeException("Could not update user in Keycloak", e);
        }

        return userRepository.save(user);
    }

    public UserDto toUserDto(User user) {
        return new UserDto(
                user.getUsername(),
                user.getEmail(),
                null, // Exclude password
                user.getKeycloakId()
        );
    }
}
