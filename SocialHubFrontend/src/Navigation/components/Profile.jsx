import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { keycloak, authenticated: isAuthenticated } = useAuth();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
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
    }
  }, [isAuthenticated]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/user/keycloak/${keycloak.subject}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
        if (userData.profilePicture) {
          setPreviewImage(
            `data:image/jpeg;base64,${btoa(
              String.fromCharCode(...new Uint8Array(userData.profilePicture))
            )}`
          );
        }
      } else {
        console.error("Failed to fetch user profile");
      }
    } catch (error) {
      console.error("Error fetching user profile", error);
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
    if (formData.password) {
      formDataToSend.append("password", formData.password);
    }
    if (formData.profilePicture) {
      formDataToSend.append("profilePicture", formData.profilePicture);
    }

    try {
      const response = await fetch("http://localhost:8080/api/user/update", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });
      if (response.ok) {
        alert("Profile updated successfully!");
        window.location.reload();
      } else {
        console.error("Failed to update profile");
        alert("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile", error);
      alert("An error occurred while updating the profile.");
    }
  };

  if (!isAuthenticated || !user) return <div className="text-white">Loading...</div>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl mb-4">Your Profile</h1>
      {editMode ? (
        <form onSubmit={handleSubmit} className="space-y-4">
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
              <img
                src={previewImage}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover"
              />
            )}
          </div>
          <button type="submit" className="bg-blue-600 p-2 rounded">
            Save
          </button>
          <button
            type="button"
            onClick={() => setEditMode(false)}
            className="bg-gray-600 p-2 rounded ml-2"
          >
            Cancel
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <strong>First Name:</strong> {user.firstName || "N/A"}
          </div>
          <div>
            <strong>Last Name:</strong> {user.lastName || "N/A"}
          </div>
          <div>
            <strong>Username:</strong> {user.username}
          </div>
          <div>
            <strong>Email:</strong> {user.email}
          </div>
          <div>
            <strong>Profile Picture:</strong>
            {previewImage ? (
              <img
                src={previewImage}
                alt="Profile"
                className="mt-2 w-32 h-32 object-cover"
              />
            ) : (
              "No image"
            )}
          </div>
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-600 p-2 rounded"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
