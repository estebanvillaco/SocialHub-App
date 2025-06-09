import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useFollowing } from "../../context/FollowingContext";
import LikeButton from "../../components/Likebutton";

const Profile = () => {
  const { keycloak, authenticated: isAuthenticated } = useAuth();
  const { following, followUser, unfollowUser } = useFollowing();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    profilePicture: null,
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile();
      fetchUserPosts();
    }
  }, [isAuthenticated]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/user/keycloak/${keycloak.subject}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setFormData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          username: userData.username || "",
          email: userData.email || "",
          password: "",
          profilePicture: null,
        });
        setPreviewImage(userData.profilePicture ? `data:image/jpeg;base64,${btoa(String.fromCharCode(...new Uint8Array(userData.profilePicture)))}` : null);
      }
    } catch (error) {
      console.error("Error fetching user profile", error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/posts?keycloakId=${keycloak.subject}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.ok) {
        const data = await response.json();
        const formattedPosts = data.map(post => ({
          id: post.id,
          user: post.user && post.user.length > 2 ? post.user : "Unknown User",
          caption: post.content || "No caption",
          image: post.imagePath ? `http://localhost:8080/images/${post.imagePath}` : null,
          likes: post.likes ?? 0,
          liked: post.liked ?? false,
          comments: post.comments || [],
        })).filter(post => post.user !== "jlle");
        setUserPosts(formattedPosts);
      }
    } catch (error) {
      console.error("Error fetching posts", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profilePicture: file });
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("username", formData.username);
    formDataToSend.append("email", formData.email);
    if (formData.password) formDataToSend.append("password", formData.password);
    if (formData.profilePicture) formDataToSend.append("profilePicture", formData.profilePicture);

    try {
      const response = await fetch("http://localhost:8080/api/user/update", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });
      if (response.ok) {
        alert("Profile updated successfully!");
        fetchUserProfile(); // Refresh profile data
      } else {
        alert("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile", error);
      alert("An error occurred while updating the profile.");
    }
  };

  const isFollowing = user && following.some(f => f.keycloakId === user.keycloakId);
  const handleFollowClick = () => {
    if (user && user.keycloakId !== keycloak.subject) {
      if (isFollowing) {
        unfollowUser(user.keycloakId);
      } else {
        followUser({ keycloakId: user.keycloakId, username: user.username });
      }
    }
  };

  if (!isAuthenticated || !user) return <div className="text-white">Loading...</div>;

  return (
    <div className="profile-page p-4 text-white">
      <button onClick={() => setEditMode(!editMode)} className="edit-button bg-blue-600 p-2 rounded mb-4">
        {editMode ? "Cancel" : "Edit"}
      </button>
      <div className="flex items-center mb-4">
        <img
          src={previewImage || "/default-profile.png"}
          alt="Profile"
          className="profile-pic w-32 h-32 object-cover rounded-full mr-4"
        />
        <div className="user-info">
          <h2>{user.username || "Unknown User"}</h2>
          <div className="stats">
            Posts: {userPosts.length} | Followers: N/A | Following: {following.length}
          </div>
          {user.keycloakId !== keycloak.subject && (
            <button
              onClick={handleFollowClick}
              className={`p-2 rounded ${isFollowing ? 'bg-red-600' : 'bg-green-600'}`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
          <button className="p-2 bg-gray-600 rounded ml-2">Message</button>
        </div>
      </div>
      <div className="bio mb-4">Bio goes here</div>
      <div className="posts-grid grid grid-cols-1 md:grid-cols-2 gap-4">
        {userPosts.length > 0 ? (
          userPosts.map((post) => (
            <div key={post.id} className="post-wrapper bg-gray-800 p-4 rounded shadow-sm">
              <div className="post-header flex justify-between items-center mb-2">
                <h3 className="post-username">{post.user}</h3>
                <div className="more-menu-wrapper">
                  <button>⋮</button>
                  <div className="more-menu hidden">
                    <button>Edit</button>
                    <button>Delete</button>
                  </div>
                </div>
              </div>
              <div className="post-content-wrapper mb-2">
                {post.image && <img src={post.image} alt={post.caption} className="post-image w-full max-h-64 object-cover" />}
                {post.caption && <p className="post-caption mt-2">{post.caption}</p>}
              </div>
              <div className="post-actions flex items-center gap-4">
                <LikeButton postId={post.id} initialLikes={post.likes} initiallyLiked={post.liked} />
                <button className="comment-button bg-gray-600 p-2 rounded">Comment</button>
              </div>
            </div>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>

      {editMode && (
        <form onSubmit={handleSubmit} className="edit-section mt-4 space-y-4">
          <div>
            <label className="block">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 rounded text-white"
            />
          </div>
          <div>
            <label className="block">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 rounded text-white"
            />
          </div>
          <div>
            <label className="block">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 rounded text-white"
            />
          </div>
          <div>
            <label className="block">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 rounded text-white"
            />
          </div>
          <div>
            <label className="block">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-700 rounded text-white"
              placeholder="Leave blank to keep current password"
            />
          </div>
          <div>
            <label className="block">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 bg-gray-700 rounded text-white"
            />
            {previewImage && (
              <img src={previewImage} alt="Preview" className="mt-2 w-32 h-32 object-cover" />
            )}
          </div>
          <div className="edit-buttons">
            <button type="submit" className="bg-blue-600 p-2 rounded">Save</button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="bg-gray-600 p-2 rounded ml-2"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;