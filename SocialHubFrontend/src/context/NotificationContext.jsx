import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { keycloak } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (keycloak?.tokenParsed?.sub) {
        try {
          const res = await api.get('/api/notifications', {
            params: { userId: keycloak.tokenParsed.sub },
          });
          setNotifications(res.data);
        } catch (err) {
          console.error("Failed to fetch notifications:", err);
          if (err.response) {
            console.error("Response data:", err.response.data);
          }
        }
      }
    };
    fetchNotifications();
  }, [keycloak]);

  const addNotification = (notification) => {
    setNotifications([notification, ...notifications]);
    if (keycloak?.tokenParsed?.sub) {
      api.post('/api/notifications', {
        userId: notification.userId,
        fromUserId: keycloak.tokenParsed.sub,
        postId: notification.postId,
        message: notification.message,
        type: notification.type,
      }).catch(err => {
        console.error("Failed to save notification:", err);
        if (err.response) {
          console.error("Response data:", err.response.data);
        }
      });
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
export default NotificationContext;