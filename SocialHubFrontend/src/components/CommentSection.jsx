import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

const CommentSection = ({ postId, ownerId }) => {
  const { keycloak } = useAuth();
  const keycloakId = keycloak?.tokenParsed?.sub;
  const { addNotification } = useNotifications();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get(`/posts/${postId}/comments`);
        setComments(res.data);
      } catch (err) {
        setError("Failed to load comments.");
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await api.post(`/posts/${postId}/comments`, null, {
        params: {
          keycloakId,
          content: newComment,
        },
      });

      setComments((prev) => [...prev, res.data]);
      setNewComment("");

      if (keycloakId !== ownerId && ownerId) {
        const username = keycloak?.tokenParsed?.preferred_username || 'Unknown User';
        const notification = {
          userId: ownerId,
          fromUserId: keycloakId,
          postId: postId,
          message: `${username} commented on your post!`,
          type: 'comment',
        };
        addNotification(notification);
      } else if (!ownerId) {
        console.error("ownerId is missing for notification");
      }
    } catch (err) {
      setError("Failed to add comment.");
    }
  };

  return (
    <div className="comment-section">
      <h4>Comments</h4>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <div className="comment-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <strong>{comment.user?.username || "Ukjent"}</strong>: {comment.content}
          </div>
        ))}
      </div>
      <div className="comment-input-container">
        <textarea
          value={newComment}
          placeholder="Write a comment..."
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleAddComment}>Add Comment</button>
      </div>
    </div>
  );
};

export default CommentSection;