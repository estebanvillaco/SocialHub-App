package com.socialhub.socialhub_backend.dto;

<<<<<<< HEAD
=======
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

>>>>>>> mine/main
import java.time.LocalDateTime;
import java.util.UUID;

public class PostDto {
<<<<<<< HEAD

    private Long id;
    private String content;
    private UUID keycloakId;
    private String imagePath;
    private LocalDateTime createdAt;
    private String user;
    private int likes;
    private boolean liked;

    public PostDto() {}

    public PostDto(Long id, String content, UUID keycloakId, String imagePath,
                   LocalDateTime createdAt, String user) {
        this.id = id;
        this.content = content;
        this.keycloakId = keycloakId;
        this.imagePath = imagePath;
        this.createdAt = createdAt;
        this.user = user;
=======
    private Long id;
    @NotBlank(message = "Content cannot be blank")
    private String content;
    @NotNull(message = "KeycloakId cannot be null")
    private UUID keycloakId;
    private String imagePath;
    private LocalDateTime createdAt;
    private String username; // Added username field

    // Constructors
    public PostDto() {}

    public PostDto(String content, UUID keycloakId) {
        this.content = content;
        this.keycloakId = keycloakId;
>>>>>>> mine/main
    }

    public PostDto(String content, UUID keycloakId, String imagePath) {
        this.content = content;
        this.keycloakId = keycloakId;
        this.imagePath = imagePath;
    }

<<<<<<< HEAD
    // Getters and setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public UUID getKeycloakId() { return keycloakId; }
    public void setKeycloakId(UUID keycloakId) { this.keycloakId = keycloakId; }

    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getUser() { return user; }
    public void setUser(String user) { this.user = user; }

    public int getLikes() { return likes; }
    public void setLikes(int likes) { this.likes = likes; }

    public boolean isLiked() { return liked; }
    public void setLiked(boolean liked) { this.liked = liked; }
}
=======
    public PostDto(Long id, String content, UUID keycloakId, String imagePath, LocalDateTime createdAt) {
        this.id = id;
        this.content = content;
        this.keycloakId = keycloakId;
        this.imagePath = imagePath;
        this.createdAt = createdAt;
    }

    public PostDto(Long id, String content, UUID keycloakId, String imagePath, LocalDateTime createdAt, String username) {
        this.id = id;
        this.content = content;
        this.keycloakId = keycloakId;
        this.imagePath = imagePath;
        this.createdAt = createdAt;
        this.username = username;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public UUID getKeycloakId() {
        return keycloakId;
    }

    public void setKeycloakId(UUID keycloakId) {
        this.keycloakId = keycloakId;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
>>>>>>> mine/main
