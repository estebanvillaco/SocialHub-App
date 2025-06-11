import React, { useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useFeed } from '../context/FeedContext';
import { useNotifications } from '../context/NotificationContext';

const LikeButton = ({ postId, initialLikes = 0, initiallyLiked = false, ownerId }) => {
  const { keycloak } = useAuth();
  const { updatePost } = useFeed();
  const { addNotification } = useNotifications();

  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(initiallyLiked);

  const handleLike = async () => {
    try {
      const keycloakId = keycloak?.tokenParsed?.sub;
      const username = keycloak?.tokenParsed?.preferred_username || 'Unknown User';
      const response = await api.post(`/posts/${postId}/like`, null, {
        params: { keycloakId },
      });

      if (response.status === 200) {
        const updatedLikes = hasLiked ? likes - 1 : likes + 1;
        setLikes(updatedLikes);
        setHasLiked(!hasLiked);

        updatePost({
          id: postId,
          likes: updatedLikes,
          liked: !hasLiked,
        });

        if (!ownerId) {
          console.error("ownerId is missing for notification");
          return;
        }

        const notification = {
          userId: ownerId,
          fromUserId: keycloakId,
          postId: postId,
          message: `${username} liked your post!`,
          type: 'like',
        };
        addNotification(notification);
      }
    } catch (error) {
      console.error("Error liking:", error);
    }
  };

  return (
    <button className="like-button" onClick={handleLike}>
      {hasLiked ? '❤️' : '🤍'} ({likes})
    </button>
  );
};

export default LikeButton;