package com.socialhub.socialhub_backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private String userId; // Mottakende brukers ID (f.eks. fra Keycloak)

    @Column(name = "from_user_id", nullable = false)
    private String fromUserId; // Den som sender varslet (f.eks. liker innlegget)

    @Column(name = "post_id")
    private Long postId; // Relaterte innlegg, om relevant

    @Column(name = "message", nullable = false)
    private String message;

    @Column(name = "type", nullable = false)
    private String type; // f.eks. "like", "comment", "follow"

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // Default constructor
    public Notification() {
        this.createdAt = LocalDateTime.now();
    }

    // Parameterized constructor
    public Notification(String userId, String fromUserId, Long postId, String message, String type) {
        this.userId = userId;
        this.fromUserId = fromUserId;
        this.postId = postId;
        this.message = message;
        this.type = type;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getFromUserId() { return fromUserId; }
    public void setFromUserId(String fromUserId) { this.fromUserId = fromUserId; }
    public Long getPostId() { return postId; }
    public void setPostId(Long postId) { this.postId = postId; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
