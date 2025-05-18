package com.socialhub.socialhub_backend.controller;

import com.socialhub.socialhub_backend.dto.UserDto;
import com.socialhub.socialhub_backend.model.User;
import com.socialhub.socialhub_backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping({"/api/user", "/users"})
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/keycloak/{keycloakId}")
    public ResponseEntity<UserDto> getUserByKeycloakId(@PathVariable String keycloakId) {
        User user = userService.getUserByKeycloakId(keycloakId);
        return ResponseEntity.ok(userService.toUserDto(user));
    }

    @PutMapping("/keycloak/{keycloakId}")
    public ResponseEntity<UserDto> updateUserByKeycloakId(@PathVariable String keycloakId, @Valid @RequestBody UserDto userDto) {
        User user = userService.updateUserByKeycloakId(keycloakId, userDto);
        return ResponseEntity.ok(userService.toUserDto(user));
    }

    @PostMapping("/sync")
    public ResponseEntity<UserDto> syncUser(@Valid @RequestBody UserDto userDto) {
        User user = userService.syncUser(userDto);
        return ResponseEntity.ok(userService.toUserDto(user));
    }

    /**
     * Oppdaterer profil i Keycloak OG lokal database.
     * Brukernavn, fornavn, etternavn og passord oppdateres i Keycloak.
     * Profilbilde og e-post lagres i lokal DB.
     */
    @PostMapping("/update")
    public ResponseEntity<UserDto> updateProfile(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @RequestParam("username") String username,
            @RequestParam("email") String email,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture) throws Exception {

        String keycloakId = jwt.getSubject();
        User updatedUser = userService.updateUser(keycloakId, firstName, lastName, username, email, password, profilePicture);
        return ResponseEntity.ok(userService.toUserDto(updatedUser));
    }
}
