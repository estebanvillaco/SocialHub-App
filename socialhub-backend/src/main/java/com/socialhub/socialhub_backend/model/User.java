package com.socialhub.socialhub_backend.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private UUID keycloakId;

    @Column(unique = true, nullable = false)
    private String email;

    private String username;

    private String firstName;
    private String lastName;

    @Lob
    private byte[] profilePicture;

    // Getters and setters
    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public UUID getKeycloakId() { return keycloakId; }

    public void setKeycloakId(UUID keycloakId) { this.keycloakId = keycloakId; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getUsername() { return username; }

    public void setUsername(String username) { this.username = username; }

    public String getFirstName() { return firstName; }

    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }

    public void setLastName(String lastName) { this.lastName = lastName; }

    public byte[] getProfilePicture() { return profilePicture; }

    public void setProfilePicture(byte[] profilePicture) { this.profilePicture = profilePicture; }
}
